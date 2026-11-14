const User = require("./user.model");
const ApiError = require("../../utils/ApiError");
const storage = require("../../utils/storage");
const { dispatchOTP, verifyOTP } = require("../auth/auth.service");

/**
 * modules/users/user.service.js
 *
 * All Profile-module business logic lives here. Controllers stay thin —
 * they parse req/res and delegate. Nothing here touches req/res directly,
 * which is what makes this layer independently testable and reusable
 * (e.g. an admin "update user on behalf of" tool could call the same
 * updateProfile function later).
 */

const EDITABLE_FIELDS = ["fullName", "phone", "bio", "address", "preferences"];

/**
 * Whitelists updatable fields. email/role/isEmailVerified are
 * deliberately never accepted here — they don't even reach this
 * function because the route-level Joi schema strips them, but this
 * second whitelist is defense-in-depth in case that schema ever drifts.
 */
const updateProfile = async (userId, payload) => {
  const updates = {};
  for (const field of EDITABLE_FIELDS) {
    if (payload[field] !== undefined) updates[field] = payload[field];
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) throw ApiError.notFound("User not found");
  return user;
};

/**
 * Uploads a new avatar, replacing the old one.
 * Deletes the previous image from the storage provider AFTER the new
 * upload succeeds — avoids leaving the user with no avatar at all if
 * the upload step fails partway through.
 */
const updateAvatar = async (userId, fileBuffer) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");

  const previousPublicId = user.avatar?.publicId || null;

  const result = await storage.upload(fileBuffer, {
    folder: "adjective/avatars",
    publicId: `user_${userId}`,
  });

  user.avatar = { url: result.url, publicId: result.publicId, provider: result.provider };
  await user.save();

  if (previousPublicId && previousPublicId !== result.publicId) {
    await storage.remove(previousPublicId).catch(() => {
      // Non-fatal: an orphaned old asset is a cleanup issue, not a user-facing error.
    });
  }

  return user;
};

/**
 * Step 1 of account deletion: send an OTP to confirm intent.
 * Deleting an account is irreversible-feeling to the user, so it gets
 * the same OTP confirmation as login/register rather than a single click.
 */
const requestAccountDeletion = async (user) => {
  await dispatchOTP({ identifier: user.email, purpose: "delete_account" });
};

/**
 * Step 2: verifies the OTP, then soft-deletes the account.
 *
 * Soft delete, not hard delete:
 *   - Preserves audit trail (listings, enquiries, transactions stay
 *     attributable — often a legal/business requirement)
 *   - Reversible by support/admin if the deletion was accidental
 *   - Avoids dangling references elsewhere in the DB (properties.ownerId,
 *     enquiries.userId, etc. would otherwise point at nothing)
 *
 * Also invalidates the refresh token so no existing session can keep
 * using the account after deletion, even before the access token expires.
 */
const confirmAccountDeletion = async (user, otp, reason) => {
  await verifyOTP({ identifier: user.email, otp, purpose: "delete_account" });

  user.isDeleted = true;
  user.deletedAt = new Date();
  user.deletionReason = reason || null;
  user.status = "deactivated";
  user.refreshTokenHash = null; // kill every existing session immediately
  await user.save();

  return user;
};

/**
 * Aggregated activity summary for the profile page.
 * Property/Enquiry/Appointment models don't exist yet in this codebase
 * (properties/enquiries modules are still empty scaffolding — see the
 * folder tree), so these are wired as safe placeholders (0) rather than
 * left out entirely. Swapping in real counts later is a one-line change
 * per field, no API contract change for the frontend.
 */
const getActivitySummary = async (userId) => {
  // Example of how this looks once those modules exist:
  // const savedPropertiesCount = await Wishlist.countDocuments({ user: userId });
  // const inquiryCount = await Enquiry.countDocuments({ user: userId });
  // const appointmentCount = await Appointment.countDocuments({ user: userId });

  return {
    savedPropertiesCount: 0,
    inquiryCount: 0,
    appointmentCount: 0,
    recentlyViewedCount: 0,
  };
};

const updateAdminSettings = async (userId, { email, password }) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw ApiError.notFound("User not found");

  // Check if email is already taken by another user
  if (email && email !== user.email) {
    const existing = await User.findOne({ email, _id: { $ne: userId } });
    if (existing) {
      throw ApiError.conflict("An account with this email already exists");
    }
    user.email = email;
  }

  if (password) {
    const bcrypt = require("bcrypt");
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
  return user;
};

module.exports = {
  updateProfile,
  updateAvatar,
  requestAccountDeletion,
  confirmAccountDeletion,
  getActivitySummary,
  updateAdminSettings,
};
