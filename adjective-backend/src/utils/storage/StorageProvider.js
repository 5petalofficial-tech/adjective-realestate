/**
 * utils/storage/StorageProvider.js
 *
 * Contract every storage provider must implement. Business logic
 * (user.service.js) only ever talks to THIS interface — never to
 * Cloudinary/S3/Azure SDKs directly. Swapping providers later means
 * writing one new file that implements this shape; zero changes to
 * controllers/services/routes.
 *
 * This is a JSDoc-only "interface" (no TypeScript in this project),
 * kept here as living documentation + a reference for what a new
 * provider must implement.
 *
 * @typedef {Object} UploadResult
 * @property {string} url        Public URL to display the image
 * @property {string} publicId   Provider-specific asset id, needed to delete/replace later
 * @property {string} provider   'cloudinary' | 's3' | 'azure'
 *
 * @interface StorageProvider
 * @method upload
 *   @param {Buffer} fileBuffer   Raw file bytes (from multer memoryStorage)
 *   @param {Object} options      { folder, publicId? }
 *   @returns {Promise<UploadResult>}
 * @method remove
 *   @param {string} publicId
 *   @returns {Promise<void>}
 */
module.exports = {};
