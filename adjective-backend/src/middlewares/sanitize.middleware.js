/**
 * Strips keys starting with '$' or containing '.' from req.body / req.params,
 * which is the standard NoSQL-injection vector (e.g. { email: { $ne: null } }).
 *
 * Note: we deliberately do NOT touch req.query here — in Express 5, req.query
 * is a read-only getter and reassigning it throws. None of our routes build
 * Mongo queries directly from req.query, so body/params coverage is sufficient.
 * If that changes, sanitize the extracted values individually at the call site.
 */
const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    const clean = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) continue; // drop dangerous keys
      clean[key] = sanitizeValue(val);
    }
    return clean;
  }

  return value;
};

const sanitizeRequest = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeValue(req.params);
  }
  next();
};

module.exports = sanitizeRequest;
