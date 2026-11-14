/**
 * Wraps an async route/controller function and forwards any rejected
 * promise to Express's error handling middleware via next(err).
 *
 * Usage:
 *   router.post('/login', asyncHandler(authController.login));
 */
const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch(next);
};

module.exports = asyncHandler;
