const rateLimit = require("express-rate-limit");

/**
 * Applied to OTP-sending endpoints (register, login, resend-otp) to
 * prevent abuse — separate from the in-service cooldown, this guards
 * at the IP level against scripted attacks.
 */
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 OTP requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests. Please try again later.",
  },
});

/** Slightly stricter limiter for OTP verification (guards brute force). */
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many verification attempts. Please try again later.",
  },
});

module.exports = { otpRequestLimiter, otpVerifyLimiter };
