const express = require("express");
const authController = require("./auth.controller");
const validate = require("../../middlewares/validate.middleware");
const { protect } = require("../../middlewares/auth.middleware");
const { otpRequestLimiter, otpVerifyLimiter } = require("../../middlewares/rateLimit.middleware");
const {
  registerSchema,
  loginSchema,
  adminLoginSchema,
  sendOtpSchema,
  verifyOtpSchema,
} = require("./auth.validation");

const router = express.Router();

// --- Admin authentication (email + password) ---
router.post("/admin-login", otpRequestLimiter, validate(adminLoginSchema), authController.adminLogin);

// --- Registration (email OTP) ---
router.post("/register", otpRequestLimiter, validate(registerSchema), authController.register);

// --- Login (email OTP) ---
router.post("/login", otpRequestLimiter, validate(loginSchema), authController.login);

// --- Shared OTP endpoints ---
router.post("/resend-otp", otpRequestLimiter, validate(sendOtpSchema), authController.resendOtp);
router.post("/verify-otp", otpVerifyLimiter, validate(verifyOtpSchema), authController.verifyOtp);

// --- Session management ---
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);

module.exports = router;
