const ApiError = require("../utils/ApiError");

/**
 * Validates req.body against a Joi schema.
 * Usage: router.post('/register', validate(registerSchema), authController.register)
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join("."),
      message: d.message,
    }));
    return next(ApiError.badRequest("Validation failed", errors));
  }

  req.body = value; // sanitized/coerced payload
  next();
};

module.exports = validate;
