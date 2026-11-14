const Joi = require("joi");

const emailField = Joi.string().trim().lowercase().email().required().messages({
  "string.email": "Enter a valid email address",
  "string.empty": "Email is required",
});

const phoneField = Joi.string()
  .trim()
  .pattern(/^[0-9]{10,15}$/)
  .required()
  .messages({
    "string.pattern.base": "Enter a valid phone number (10-15 digits)",
    "string.empty": "Phone number is required",
  });

const otpField = Joi.string()
  .trim()
  .pattern(/^[0-9]{6}$/)
  .required()
  .messages({
    "string.pattern.base": "OTP must be a 6-digit code",
  });

const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(80).required().messages({
    "string.min": "Full name must be at least 3 characters",
    "string.empty": "Full name is required",
  }),
  email: emailField,
  phone: phoneField,
  // NOTE: role is intentionally NOT accepted here. Public registration is
  // always role: 'user' (enforced in auth.service.js). Because validate()
  // uses stripUnknown, a client-sent `role` field is silently discarded
  // rather than merely ignored — it never reaches the controller/service.
});

const loginSchema = Joi.object({
  email: emailField,
});

const adminLoginSchema = Joi.object({
  email: emailField,
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

const sendOtpSchema = Joi.object({
  email: emailField,
  purpose: Joi.string().valid("register", "login", "brochure_verify").required(),
});

const verifyOtpSchema = Joi.object({
  email: emailField,
  otp: otpField,
  purpose: Joi.string().valid("register", "login", "brochure_verify").required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().optional(), // usually read from cookie instead
});

module.exports = {
  registerSchema,
  loginSchema,
  adminLoginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
};
