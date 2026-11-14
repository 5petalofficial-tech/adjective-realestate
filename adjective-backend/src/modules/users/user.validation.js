const Joi = require("joi");

/**
 * PUT /api/users/me — only these fields are ever editable by the user.
 * email, role, isEmailVerified, status etc. deliberately have NO schema
 * entry here, so Joi's stripUnknown (see validate.middleware) removes
 * them even if a client sends them — defense before it ever reaches
 * the service-layer whitelist in user.service.js.
 */
const updateProfileSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(80),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .messages({ "string.pattern.base": "Enter a valid phone number (10-15 digits)" }),
  bio: Joi.string().trim().max(500).allow(""),
  address: Joi.object({
    street: Joi.string().trim().max(120).allow(""),
    city: Joi.string().trim().max(60).allow(""),
    state: Joi.string().trim().max(60).allow(""),
    country: Joi.string().trim().max(60).allow(""),
    postalCode: Joi.string().trim().max(20).allow(""),
  }),
  preferences: Joi.object({
    notifications: Joi.object({
      email: Joi.boolean(),
      sms: Joi.boolean(),
    }),
    language: Joi.string().trim().max(10),
    theme: Joi.string().valid("light", "dark", "system"),
  }),
}).min(1);

const requestDeletionSchema = Joi.object({
  reason: Joi.string().trim().max(300).allow("", null),
});

const confirmDeletionSchema = Joi.object({
  otp: Joi.string()
    .trim()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({ "string.pattern.base": "OTP must be a 6-digit code" }),
  reason: Joi.string().trim().max(300).allow("", null),
});

const agentApplicationSchema = Joi.object({
  agencyName: Joi.string().trim().min(2).max(120).required(),
  licenseNumber: Joi.string().trim().min(3).max(60).required(),
  bio: Joi.string().trim().max(1000).allow("", null),
});

const agentStatusUpdateSchema = Joi.object({
  status: Joi.string().valid("approved", "rejected", "suspended").required(),
  rejectionReason: Joi.string().trim().max(300).when("status", {
    is: "rejected",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

const userStatusUpdateSchema = Joi.object({
  status: Joi.string().valid("active", "suspended", "deactivated").required(),
});

const updateAdminSettingsSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().trim().min(6).allow(""),
});

module.exports = {
  updateProfileSchema,
  requestDeletionSchema,
  confirmDeletionSchema,
  agentApplicationSchema,
  agentStatusUpdateSchema,
  userStatusUpdateSchema,
  updateAdminSettingsSchema,
};
