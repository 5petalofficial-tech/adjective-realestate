const mongoose = require("mongoose");

/**
 * Generic OTP store — works for email today, and phone-based OTP later
 * (just pass channel: 'phone' and identifier: the phone number).
 *
 * The TTL index auto-deletes documents once `expiresAt` passes,
 * so expired OTPs never pile up.
 */
const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String, // email address or phone number
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    channel: {
      type: String,
      enum: ["email", "phone"],
      default: "email",
    },
    purpose: {
      type: String,
      enum: ["register", "login", "delete_account", "brochure_verify"],
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Document auto-removed by MongoDB once expiresAt is reached.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ identifier: 1, purpose: 1 });

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
