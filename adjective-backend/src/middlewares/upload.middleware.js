const multer = require("multer");
const ApiError = require("../utils/ApiError");

/**
 * middlewares/upload.middleware.js
 *
 * Uses memoryStorage (buffer in RAM, never written to disk) — the
 * buffer is handed straight to the active storage provider's upload
 * stream (see utils/storage/). Keeps the server stateless, no temp
 * file cleanup to worry about.
 */

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const fileFilter = (_req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      ApiError.badRequest(`Unsupported file type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`)
    );
  }
  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter,
});

/** Usage: router.post('/avatar', protect, uploadAvatar, controller) */
const uploadAvatar = upload.single("avatar");

module.exports = { upload, uploadAvatar, ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES };
