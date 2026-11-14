const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
const authService = require("./auth.service");
const { cookieOptions, REFRESH_COOKIE_MAX_AGE } = require("../../utils/token.util");

const REFRESH_COOKIE_NAME = "adj_refresh_token";

/**
 * Attaches the refresh token as an httpOnly cookie and returns the
 * access token + user in the JSON body. The access token is handed
 * to the client to keep in memory (never localStorage).
 */
const sendAuthResponse = (res, statusCode, message, { user, accessToken, refreshToken }) => {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });

  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, { user, accessToken }, message));
};

/**
 * POST /api/auth/register
 * Step 1 of sign-up: validate + create unverified user, send OTP.
 */
const register = asyncHandler(async (req, res) => {
  const { fullName, email, phone } = req.body;

  await authService.initiateRegistration({ fullName, email, phone });

  return res
    .status(200)
    .json(new ApiResponse(200, { email }, "Verification code sent to your email"));
});

/**
 * POST /api/auth/login
 * Step 1 of sign-in: validate existing verified user, send OTP.
 */
const login = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // initiateLogin silently no-ops if the account doesn't exist / isn't
  // verified / isn't active — the response below is identical either way.
  await authService.initiateLogin({ email });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email },
        "If an account exists with this email, a verification code has been sent"
      )
    );
});

/**
 * POST /api/auth/resend-otp
 * Re-sends an OTP for either purpose, reusing the same rate limit
 * logic as the original send (see auth.service.dispatchOTP).
 */
const resendOtp = asyncHandler(async (req, res) => {
  const { email, purpose } = req.body;

  await authService.resendOTP({ email, purpose });

  const message =
    purpose === "login"
      ? "If an account exists with this email, a verification code has been sent"
      : "Verification code resent";

  return res.status(200).json(new ApiResponse(200, { email }, message));
});

/**
 * POST /api/auth/verify-otp
 * Step 2 for both register + login: confirms the OTP, then issues a session.
 */
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp, purpose } = req.body;

  await authService.verifyOTP({ identifier: email, otp, purpose });

  const session =
    purpose === "register"
      ? await authService.completeRegistration(email)
      : await authService.completeLogin(email, req.ip);

  const message = purpose === "register" ? "Account verified successfully" : "Signed in successfully";

  return sendAuthResponse(res, 200, message, session);
});

/**
 * POST /api/auth/refresh-token
 * Reads the refresh token from the httpOnly cookie and issues a new pair.
 */
const refreshToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.[REFRESH_COOKIE_NAME];

  const session = await authService.refreshSession(incomingToken);

  return sendAuthResponse(res, 200, "Session refreshed", session);
});

/**
 * POST /api/auth/logout
 * Clears the refresh token cookie and revokes it server-side.
 */
const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);

  res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);

  return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

/**
 * POST /api/auth/admin-login
 * Authenticates admin user with email and password.
 */
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const session = await authService.adminLogin({ email, password, ip: req.ip });

  return sendAuthResponse(res, 200, "Admin signed in successfully", session);
});

/**
 * GET /api/auth/me
 * Returns the currently authenticated user (requires auth middleware).
 */
const getMe = asyncHandler(async (req, res) => {
  if (!req.user) throw ApiError.unauthorized("Not authenticated");
  return res.status(200).json(new ApiResponse(200, { user: req.user }, "Current user"));
});

module.exports = {
  register,
  login,
  adminLogin,
  resendOtp,
  verifyOtp,
  refreshToken,
  logout,
  getMe,
};
