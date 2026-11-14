const mongoose = require("mongoose");
const crypto = require("crypto");

const ROLES = ["user", "agent", "admin"];

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 3,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      sparse: true, // allows multiple nulls if phone ever becomes optional
    },
    role: {
      type: String,
      enum: ROLES,
      default: "user",
    },
    password: {
      type: String,
      select: false,
    },

    // --- Verification state ---
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    // --- Account status (admin-controlled) ---
    status: {
      type: String,
      enum: ["active", "suspended", "deactivated"],
      default: "active",
    },

    // --- Profile (public-facing personal info) ---
    avatar: {
      url: { type: String, default: null },
      publicId: { type: String, default: null }, // storage-provider asset id, needed to delete/replace later
      provider: { type: String, enum: ["cloudinary", "s3", "azure"], default: "cloudinary" },
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    address: {
      street: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      country: { type: String, trim: true, default: "" },
      postalCode: { type: String, trim: true, default: "" },
    },

    // --- Preferences (self-managed, non-security settings) ---
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      language: { type: String, default: "en" },
      theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    },

    // --- Agent-only fields (populated when user applies to become an agent) ---
    agentProfile: {
      status: {
        type: String,
        enum: ["none", "pending", "approved", "rejected", "suspended"],
        default: "none",
      },
      agencyName: { type: String, trim: true },
      licenseNumber: { type: String, trim: true },
      bio: { type: String, maxlength: 1000 },
      appliedAt: { type: Date, default: null },
      approvedAt: { type: Date, default: null },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      rejectionReason: { type: String, default: null },
    },

    // --- Soft delete (audit-preserving account deletion) ---
    // We never hard-delete a user document: real estate platforms need to
    // keep listings/enquiries/transactions attributable for legal and
    // business-record reasons even after a user closes their account.
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletionReason: {
      type: String,
      default: null,
    },

    // --- Unverified-account cleanup ---
    // Set on creation for unverified users; cleared once verified.
    // A partial TTL index (below) auto-deletes stale unverified signups
    // so the users collection never accumulates abandoned registrations.
    pendingExpiresAt: {
      type: Date,
      default: null,
    },

    // --- Auth/session bookkeeping ---
    refreshTokenHash: {
      type: String,
      default: null,
      select: false, // never returned by default queries
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    lastLoginIp: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.refreshTokenHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Auto-deletes a user document 24h after creation if it never got verified.
// partialFilterExpression scopes the TTL to unverified docs only, so
// verified users (where pendingExpiresAt is cleared to null) are unaffected.
userSchema.index(
  { pendingExpiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { isEmailVerified: false },
  }
);

userSchema.index({ isDeleted: 1 });

/**
 * Compares a candidate plain password against the stored bcrypt hash.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  const bcrypt = require("bcrypt");
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Hashes and stores the refresh token so a leaked DB dump alone
 * can't be used to mint sessions (same principle as password hashing).
 */
userSchema.methods.setRefreshToken = function (hash) {
  this.refreshTokenHash = hash;
};

userSchema.methods.compareRefreshTokenHash = function (hash) {
  return this.refreshTokenHash === hash;
};

/** Deterministic hash used to compare/store refresh tokens (not bcrypt — see auth.service). */
userSchema.statics.hashToken = function (token) {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
module.exports.ROLES = ROLES;
