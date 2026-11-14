const ApiError = require("../utils/ApiError");

/**
 * Converts thrown errors (ApiError, Mongoose errors, JWT errors, or
 * anything unexpected) into a consistent JSON response shape.
 * Register this LAST in app.js, after all routes.
 */
const errorMiddleware = (err, req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    // Mongoose duplicate key
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      error = ApiError.conflict(`An account with this ${field} already exists`);
    }
    // Mongoose validation error
    else if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      error = ApiError.badRequest("Validation failed", errors);
    }
    // Mongoose invalid ObjectId
    else if (error.name === "CastError") {
      error = ApiError.badRequest(`Invalid ${error.path}: ${error.value}`);
    } else {
      const statusCode = error.statusCode || 500;
      error = new ApiError(statusCode, error.message || "Internal server error", [], error.stack);
    }
  }

  // --- Observability & Error Logging ---
  if (error.isOperational && error.statusCode < 500) {
    console.warn(`[API ${error.statusCode}] ${req.method} ${req.originalUrl} - ${error.message}`);
  } else {
    console.error(error);
  }

  return res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    // Never leak internal/SMTP/DB error details to the client
    message: error.statusCode >= 500
      ? "Something went wrong. Please try again."
      : error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && error.statusCode >= 500 && { detail: error.message }),
  });
};

module.exports = errorMiddleware;
