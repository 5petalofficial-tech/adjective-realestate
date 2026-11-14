const express = require("express");
const userController = require("./user.controller");
const { protect, authorize } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { uploadAvatar } = require("../../middlewares/upload.middleware");
const { otpRequestLimiter, otpVerifyLimiter } = require("../../middlewares/rateLimit.middleware");
const {
  updateProfileSchema,
  requestDeletionSchema,
  confirmDeletionSchema,
  agentApplicationSchema,
  agentStatusUpdateSchema,
  userStatusUpdateSchema,
  updateAdminSettingsSchema,
} = require("./user.validation");

const router = express.Router();

// All routes below require authentication
router.use(protect);

// --- Self-service: Profile module ---
router.get("/me", userController.getMe);
router.put("/me", validate(updateProfileSchema), userController.updateMe);
router.post("/upload-avatar", uploadAvatar, userController.uploadAvatar);
router.get("/activity", userController.getActivity);

// Account deletion — two-step, OTP-confirmed (see user.controller.js)
router.post(
  "/me/request-deletion",
  otpRequestLimiter,
  validate(requestDeletionSchema),
  userController.requestAccountDeletion
);
router.delete("/me", otpVerifyLimiter, validate(confirmDeletionSchema), userController.deleteMe);

// --- Agent application flow ---
router.post("/apply-agent", validate(agentApplicationSchema), userController.applyForAgent);

// --- Admin only ---
router.get("/", authorize("admin"), userController.listUsers);
router.get("/agent-applications", authorize("admin"), userController.listAgentApplications);
router.put(
  "/admin/settings",
  authorize("admin"),
  validate(updateAdminSettingsSchema),
  userController.updateAdminSettings
);
router.patch(
  "/:id/status",
  authorize("admin"),
  validate(userStatusUpdateSchema),
  userController.updateUserStatus
);
router.patch(
  "/:id/agent-status",
  authorize("admin"),
  validate(agentStatusUpdateSchema),
  userController.updateAgentStatus
);

module.exports = router;
