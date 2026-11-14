const User = require("../users/user.model");
const OTP = require("./otp.model");
const ApiError = require("../../utils/ApiError");
const { generateOTP, hashOTP, compareOTP, getOTPExpiry } = require("../../utils/otp.util");
const { sendOTPEmail } = require("../../utils/email.util");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../utils/token.util");

const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute between OTP sends (email-based cooldown)
const PENDING_USER_TTL_MS = 24 * 60 * 60 * 1000; // unverified signups expire after 24h

/**
 * Creates (or reuses) a pending user record and dispatches an OTP.
 *
 * Role is ALWAYS 'user' here — this is the only path a client can reach
 * without authentication, so it must never accept a client-supplied role.
 * 'agent' is granted later via the apply-agent → admin-approval flow
 * (see users/user.controller.js), and 'admin' is never public at all.
 */
const initiateRegistration = async ({ fullName, email, phone }) => {
  const existingVerifiedUser = await User.findOne({
    $or: [{ email }, { phone }],
    isEmailVerified: true,
  });

  if (existingVerifiedUser) {
    throw ApiError.conflict(
      existingVerifiedUser.email === email
        ? "An account with this email already exists"
        : "An account with this phone number already exists"
    );
  }

  // Upsert an unverified placeholder so repeated signup attempts
  // (e.g. user closes tab and retries) don't create duplicates.
  // pendingExpiresAt refreshes on every attempt and is cleared once
  // verified (see completeRegistration) — the TTL index in user.model.js
  // handles cleanup automatically, no cron job needed.
  let user = await User.findOne({ email });
  if (user) {
    if (user.isEmailVerified) {
      // Shouldn't normally reach here (caught above), but guards races.
      throw ApiError.conflict("An account with this email already exists");
    }
    user.fullName = fullName;
    user.phone = phone;
    user.role = "user";
    user.pendingExpiresAt = new Date(Date.now() + PENDING_USER_TTL_MS);
    await user.save();
  } else {
    user = await User.create({
      fullName,
      email,
      phone,
      role: "user",
      pendingExpiresAt: new Date(Date.now() + PENDING_USER_TTL_MS),
    });
  }

  await dispatchOTP({ identifier: email, purpose: "register" });

  return user;
};

/**
 * Sends an OTP for either 'register' or 'login', enforcing an email-based
 * resend cooldown (IP-based limiting is handled separately by
 * middlewares/rateLimit.middleware.js at the route level).
 */
const dispatchOTP = async ({ identifier, purpose }) => {
  const recent = await OTP.findOne({ identifier, purpose }).sort({ createdAt: -1 });

  if (recent && Date.now() - recent.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    const waitSeconds = Math.ceil(
      (RESEND_COOLDOWN_MS - (Date.now() - recent.createdAt.getTime())) / 1000
    );
    throw ApiError.tooManyRequests(`Please wait ${waitSeconds}s before requesting a new code`);
  }

  const otp = generateOTP();
  const otpHash = await hashOTP(otp);

  // Invalidate any previous unused OTPs for this identifier + purpose
  // so only the most recently issued code is ever valid.
  await OTP.updateMany({ identifier, purpose, isUsed: false }, { isUsed: true });

  await OTP.create({
    identifier,
    channel: "email",
    purpose,
    otpHash,
    expiresAt: getOTPExpiry(),
  });

  await sendOTPEmail(
    identifier,
    otp,
    purpose === "register" ? "verify your account" : "sign in"
  );
};

/**
 * Sends a login OTP.
 *
 * Enumeration-safe by design: this function never throws for "user not
 * found" — it silently no-ops so the controller can return the exact
 * same generic response regardless of whether the email is registered.
 * It DOES throw for rate-limiting (too many requests), since that
 * response is identical whether or not the account exists.
 */
const initiateLogin = async ({ email }) => {
  const user = await User.findOne({ email });

  const eligible = user && user.isEmailVerified && user.status === "active" && !user.isDeleted;
  if (!eligible) {
    return; // silent no-op — no OTP sent, no error, no information leaked
  }

  await dispatchOTP({ identifier: email, purpose: "login" });
};

/**
 * Verifies an OTP for a given identifier + purpose.
 * Throws on: no OTP found, expired, too many attempts, mismatch.
 * On success the OTP is marked used (invalidated) immediately.
 */
const verifyOTP = async ({ identifier, otp, purpose }) => {
  const record = await OTP.findOne({ identifier, purpose, isUsed: false }).sort({
    createdAt: -1,
  });

  if (!record) {
    throw ApiError.badRequest("No active OTP found. Please request a new one.");
  }

  if (record.expiresAt.getTime() < Date.now()) {
    throw ApiError.badRequest("This code has expired. Please request a new one.");
  }

  if (record.attempts >= record.maxAttempts) {
    throw ApiError.tooManyRequests("Too many incorrect attempts. Please request a new code.");
  }

  const isMatch = await compareOTP(otp, record.otpHash);

  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    const remaining = record.maxAttempts - record.attempts;
    throw ApiError.badRequest(
      remaining > 0
        ? `Incorrect code. ${remaining} attempt(s) left.`
        : "Too many incorrect attempts. Please request a new code."
    );
  }

  record.isUsed = true;
  await record.save();
};

/**
 * Completes registration after OTP is verified: marks the user verified,
 * clears the pending-cleanup TTL (so the TTL index never touches this
 * document again), and issues a session.
 */
const completeRegistration = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound("User not found");

  user.isEmailVerified = true;
  user.pendingExpiresAt = null;
  await user.save();

  return issueSession(user);
};

/** Completes login after OTP is verified: issues a fresh session. */
const completeLogin = async (email, ip) => {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound("User not found");

  user.lastLoginAt = new Date();
  user.lastLoginIp = ip || null;

  return issueSession(user);
};

/**
 * Issues access + refresh tokens for a user and persists a SHA-256 hash
 * of the refresh token (never the raw token) so it can be verified or
 * revoked later without the DB itself holding a usable credential.
 */
const issueSession = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshTokenHash = User.hashToken(refreshToken);
  await user.save();

  return { user, accessToken, refreshToken };
};

/**
 * Rotates a refresh token: verifies the incoming token, confirms it
 * matches what's stored (i.e. hasn't already been rotated/revoked), then
 * issues a brand new pair. This invalidates the old refresh token.
 *
 * Reuse detection: if a valid-looking, correctly-signed token arrives but
 * its hash no longer matches what's stored, that token was already
 * rotated away — someone is replaying an old token. We treat this as
 * probable theft and kill the session entirely, forcing re-login.
 */
const refreshSession = async (incomingToken) => {
  if (!incomingToken) throw ApiError.unauthorized("Refresh token missing");

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingToken);
  } catch (err) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.sub).select("+refreshTokenHash");
  if (!user || !user.refreshTokenHash || user.isDeleted) {
    throw ApiError.unauthorized("Session no longer valid");
  }

  const incomingHash = User.hashToken(incomingToken);
  if (incomingHash !== user.refreshTokenHash) {
    // Reuse of a rotated-out token — invalidate the whole session.
    user.refreshTokenHash = null;
    await user.save();
    throw ApiError.unauthorized("Session invalidated. Please sign in again.");
  }

  return issueSession(user);
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
};

/**
 * Resends an OTP for an existing user without re-running full
 * registration validation. Enumeration-safe for purpose 'login'
 * (mirrors initiateLogin); purpose 'register' requires a pending
 * unverified user to already exist (created by /register), so it's
 * safe to be explicit there.
 */
const resendOTP = async ({ email, purpose }) => {
  if (purpose === "login") {
    return initiateLogin({ email }); // silent no-op if not eligible
  }

  const user = await User.findOne({ email, isEmailVerified: false });
  if (!user) {
    throw ApiError.notFound("No pending registration found for this email");
  }

  await dispatchOTP({ identifier: email, purpose });
};

/**
 * Authenticates an admin user using email and password.
 * Issues standard access + refresh token session on success.
 */
const adminLogin = async ({ email, password, ip }) => {
  const user = await User.findOne({ email, isDeleted: false }).select("+password");

  if (!user || user.role !== "admin") {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (user.status !== "active") {
    throw ApiError.forbidden("This admin account has been suspended");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  user.lastLoginAt = new Date();
  user.lastLoginIp = ip || null;
  await user.save();

  return issueSession(user);
};

module.exports = {
  initiateRegistration,
  initiateLogin,
  adminLogin,
  verifyOTP,
  completeRegistration,
  completeLogin,
  refreshSession,
  logout,
  resendOTP,
  dispatchOTP, // reused by users/user.service.js for the delete-account OTP step
};
