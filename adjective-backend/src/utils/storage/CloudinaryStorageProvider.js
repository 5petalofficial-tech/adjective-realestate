const cloudinary = require("cloudinary").v2;
const ApiError = require("../ApiError");

/**
 * utils/storage/CloudinaryStorageProvider.js
 * Implements StorageProvider using Cloudinary. See StorageProvider.js
 * for the contract this must satisfy.
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a buffer to Cloudinary via its upload_stream API (works
 * directly with multer's in-memory buffer, no temp files on disk).
 */
const upload = (fileBuffer, { folder = "adjective/avatars", publicId } = {}) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === "your_cloud_name") {
    return Promise.reject(
      ApiError.internal("Cloudinary credentials are not configured in backend .env")
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
        transformation: [{ width: 512, height: 512, crop: "fill", gravity: "face" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          provider: "cloudinary",
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const remove = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { upload, remove };
