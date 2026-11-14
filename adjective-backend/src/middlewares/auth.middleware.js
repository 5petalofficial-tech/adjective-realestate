const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { verifyAccessToken } = require("../utils/token.util");
const User = require("../modules/users/user.model");

/**
 * Verifies the access token (Authorization: Bearer <token>) and
 * attaches the authenticated user to req.user.
 */
const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    throw ApiError.unauthorized("Authentication token missing");
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw ApiError.unauthorized(
      err.name === "TokenExpiredError" ? "Session expired, please refresh" : "Invalid token"
    );
  }

  const user = await User.findById(decoded.sub);
  if (!user || user.isDeleted) {
    throw ApiError.unauthorized("User no longer exists");
  }

  if (user.status !== "active") {
    throw ApiError.forbidden("This account has been suspended");
  }

  req.user = user;
  next();
});

/**
 * Restricts a route to specific roles. Must run after `protect`.
 * Usage: router.get('/admin/stats', protect, authorize('admin'), handler)
 */
const authorize = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized("Authentication required");
  }
  if (!allowedRoles.includes(req.user.role)) {
    throw ApiError.forbidden("You do not have permission to perform this action");
  }
  next();
};

module.exports = { protect, authorize };
