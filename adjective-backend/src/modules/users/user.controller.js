const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
const User = require("./user.model");
const userService = require("./user.service");
const { cookieOptions } = require("../../utils/token.util");

/** GET /api/users/me — the logged-in user's own profile. */
const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, { user: req.user }, "Profile fetched"));
});

/**
 * PUT /api/users/me — update editable self-fields only.
 * All business logic (whitelisting, validation) lives in user.service.js —
 * this handler just parses req/res and delegates.
 */
const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, { user }, "Profile updated"));
});

/**
 * POST /api/users/upload-avatar
 * `uploadAvatar` multer middleware (see middlewares/upload.middleware.js)
 * runs first and populates req.file with an in-memory buffer.
 */
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest("No image file provided");

  const user = await userService.updateAvatar(req.user._id, req.file.buffer);
  return res.status(200).json(new ApiResponse(200, { user }, "Avatar updated"));
});

/**
 * POST /api/users/me/request-deletion
 * Step 1 of account deletion — sends an OTP to the user's email.
 */
const requestAccountDeletion = asyncHandler(async (req, res) => {
  await userService.requestAccountDeletion(req.user);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "A verification code has been sent to confirm account deletion"));
});

/**
 * DELETE /api/users/me
 * Step 2 — verifies the OTP, then soft-deletes and logs the user out.
 */
const deleteMe = asyncHandler(async (req, res) => {
  const { otp, reason } = req.body;

  await userService.confirmAccountDeletion(req.user, otp, reason);

  res.clearCookie("adj_refresh_token", cookieOptions);

  return res.status(200).json(new ApiResponse(200, null, "Account deleted successfully"));
});

/** GET /api/users/activity — saved properties / inquiries / appointments summary. */
const getActivity = asyncHandler(async (req, res) => {
  const activity = await userService.getActivitySummary(req.user._id);
  return res.status(200).json(new ApiResponse(200, { activity }, "Activity summary fetched"));
});

/**
 * POST /api/users/apply-agent
 * A regular 'user' applies to become an agent. Role stays 'user' until
 * an admin approves the application — applying never grants access by itself.
 */
const applyForAgent = asyncHandler(async (req, res) => {
  const { agencyName, licenseNumber, bio } = req.body;

  if (req.user.role !== "user") {
    throw ApiError.badRequest("Only regular users can apply to become an agent");
  }

  if (["pending", "approved"].includes(req.user.agentProfile?.status)) {
    throw ApiError.conflict(
      req.user.agentProfile.status === "pending"
        ? "You already have a pending agent application"
        : "You are already an approved agent"
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      agentProfile: {
        status: "pending",
        agencyName,
        licenseNumber,
        bio: bio || "",
        appliedAt: new Date(),
        approvedAt: null,
        approvedBy: null,
        rejectionReason: null,
      },
    },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Agent application submitted for review"));
});

/** GET /api/users — admin only: list users, filterable by role/status. */
const listUsers = asyncHandler(async (req, res) => {
  const { role, status, page = 1, limit = 20 } = req.query;

  const filter = { isDeleted: false };
  if (role) filter.role = role;
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { users, pagination: { total, page: Number(page), limit: Number(limit) } },
      "Users fetched"
    )
  );
});

/** GET /api/users/agent-applications — admin only: list pending agent applications. */
const listAgentApplications = asyncHandler(async (req, res) => {
  const users = await User.find({ "agentProfile.status": "pending" }).sort({
    "agentProfile.appliedAt": 1,
  });

  return res.status(200).json(new ApiResponse(200, { users }, "Pending agent applications"));
});

/** PATCH /api/users/:id/status — admin only: suspend/reactivate an account. */
const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!user) throw ApiError.notFound("User not found");

  return res.status(200).json(new ApiResponse(200, { user }, "User status updated"));
});

/**
 * PATCH /api/users/:id/agent-status — admin only: approve/reject/suspend
 * an agent application. This is the ONLY place agentProfile.status changes
 * and the ONLY place role is ever promoted to 'agent'.
 */
const updateAgentStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound("User not found");

  const currentStatus = user.agentProfile?.status || "none";
  if (currentStatus === "none") {
    throw ApiError.badRequest("User has no agent application on file");
  }

  user.agentProfile.status = status;

  if (status === "approved") {
    user.role = "agent";
    user.agentProfile.approvedAt = new Date();
    user.agentProfile.approvedBy = req.user._id;
    user.agentProfile.rejectionReason = null;
  } else if (status === "rejected") {
    user.agentProfile.rejectionReason = rejectionReason;
  } else if (status === "suspended") {
    // Revoke agent-only access immediately; history stays in agentProfile.
    user.role = "user";
  }

  await user.save();

  return res.status(200).json(new ApiResponse(200, { user }, `Agent application ${status}`));
});

const updateAdminSettings = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.updateAdminSettings(req.user._id, { email, password });
  return res.status(200).json(new ApiResponse(200, { user }, "Admin settings updated successfully"));
});

module.exports = {
  getMe,
  updateMe,
  uploadAvatar,
  requestAccountDeletion,
  deleteMe,
  getActivity,
  applyForAgent,
  listUsers,
  listAgentApplications,
  updateUserStatus,
  updateAgentStatus,
  updateAdminSettings,
};
