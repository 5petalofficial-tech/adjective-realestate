// modules/blog-categories/service/category.service.js

const Category = require("../model/category.model");
const ApiError = require("../../../utils/ApiError");
const { paginate } = require("../../../utils/paginate.helper");
const storage = require("../../../utils/storage");

const CLOUDINARY_FOLDER = "adjective/blog-categories";

const createCategory = async ({ payload, imageFile, userId }) => {
  let image = { url: null, publicId: null };

  if (imageFile) {
    const uploaded = await storage.upload(imageFile.buffer, { folder: CLOUDINARY_FOLDER });
    image = { url: uploaded.url, publicId: uploaded.publicId };
  }

  const category = await Category.create({
    ...payload,
    image,
    createdBy: userId,
  });

  return category;
};

const updateCategory = async ({ id, payload, imageFile, userId }) => {
  const category = await Category.findOne({ _id: id, isDeleted: false });
  if (!category) throw new ApiError(404, "Category not found");

  let previousPublicId = null;

  if (imageFile) {
    const uploaded = await storage.upload(imageFile.buffer, { folder: CLOUDINARY_FOLDER });
    previousPublicId = category.image?.publicId || null;
    category.image = { url: uploaded.url, publicId: uploaded.publicId };
  }

  Object.assign(category, payload, { updatedBy: userId });
  await category.save();

  if (previousPublicId) {
    storage.remove(previousPublicId).catch((err) =>
      console.error(`Failed to delete old category image ${previousPublicId}:`, err.message)
    );
  }

  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findOne({ _id: id, isDeleted: false });
  if (!category) throw new ApiError(404, "Category not found");

  if (category.blogsCount > 0) {
    throw new ApiError(
      409,
      `Cannot delete category with ${category.blogsCount} active blog(s). Reassign or archive them first.`
    );
  }

  category.isDeleted = true;
  category.deletedAt = new Date();
  await category.save();

  return category;
};

const restoreCategory = async (id) => {
  const category = await Category.findOne({ _id: id, isDeleted: true });
  if (!category) throw new ApiError(404, "Deleted category not found");

  category.isDeleted = false;
  category.deletedAt = null;
  await category.save();

  return category;
};

const getCategoryById = async (id) => {
  const category = await Category.findOne({ _id: id, isDeleted: false });
  if (!category) throw new ApiError(404, "Category not found");
  return category;
};

const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug, isDeleted: false }).active();
  if (!category) throw new ApiError(404, "Category not found");
  return category;
};

const listCategoriesAdmin = async ({ page, limit, status, search, sortBy, sortOrder }) => {
  const filter = { isDeleted: false };
  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };

  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  return paginate(Category, filter, { page, limit, sort });
};

const listCategoriesPublic = async () => {
  return Category.find({ status: "active", isDeleted: false })
    .sort({ sortOrder: 1, name: 1 })
    .select("name slug description image blogsCount")
    .lean();
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
  getCategoryById,
  getCategoryBySlug,
  listCategoriesAdmin,
  listCategoriesPublic,
};
