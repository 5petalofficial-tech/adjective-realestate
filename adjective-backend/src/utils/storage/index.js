/**
 * utils/storage/index.js
 *
 * Factory — picks the active storage provider based on STORAGE_PROVIDER
 * in .env. Everything else in the app imports FROM HERE, never from a
 * specific provider file directly.
 *
 * To add AWS S3 later:
 *   1. Create utils/storage/S3StorageProvider.js implementing the same
 *      { upload, remove } shape as CloudinaryStorageProvider.js
 *   2. Add a case below
 *   3. Set STORAGE_PROVIDER=s3 in .env
 * No controller, service, or route changes needed.
 */
const cloudinaryProvider = require("./CloudinaryStorageProvider");

const PROVIDER = process.env.STORAGE_PROVIDER || "cloudinary";

const providers = {
  cloudinary: cloudinaryProvider,
  // s3: require("./S3StorageProvider"),       // future
  // azure: require("./AzureStorageProvider"), // future
};

const activeProvider = providers[PROVIDER];

if (!activeProvider) {
  throw new Error(`Unknown STORAGE_PROVIDER "${PROVIDER}". Available: ${Object.keys(providers).join(", ")}`);
}

module.exports = activeProvider;
