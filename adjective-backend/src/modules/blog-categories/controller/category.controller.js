// modules/blog-categories/controller/category.controller.js
// -----------------------------------------------------------------------------
// IMPORT ASSUMPTION: `catchAsync` (wraps async controllers so you don't need
// try/catch everywhere) and `sendResponse` (your standard { success, message,
// data } shape) are assumed to live in shared/utils — same as the response/
// pagination/cloudinary helpers referenced in the service layer. Adjust the
// two paths below if named differently; nothing else in this file changes.
// -----------------------------------------------------------------------------

const asyncHandler = require("../../../utils/asyncHandler");
const ApiResponse = require("../../../utils/ApiResponse");
const categoryService = require("../service/category.service");
const {
  createCategorySchema,
  updateCategorySchema,
  listCategoriesQuerySchema,
} = require("../validation/category.validation");

// -- Admin --------------------------------------------------------------

const createCategory = asyncHandler(async (req, res) => {
  const payload = await createCategorySchema.validateAsync(req.body);
  const category = await categoryService.createCategory({
    payload,
    imageFile: req.file || null,
    userId: req.user._id,
  });
  return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const payload = await updateCategorySchema.validateAsync(req.body);
  const category = await categoryService.updateCategory({
    id: req.params.id,
    payload,
    imageFile: req.file || null,
    userId: req.user._id,
  });
  return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Category deleted successfully"));
});

const restoreCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.restoreCategory(req.params.id);
  return res.status(200).json(new ApiResponse(200, category, "Category restored successfully"));
});

const getCategoryByIdAdmin = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  return res.status(200).json(new ApiResponse(200, category, "Category fetched successfully"));
});

const listCategoriesAdmin = asyncHandler(async (req, res) => {
  const query = await listCategoriesQuerySchema.validateAsync(req.query);
  const result = await categoryService.listCategoriesAdmin(query);
  return res.status(200).json(new ApiResponse(200, result, "Categories fetched successfully"));
});

// -- Public ---------------------------------------------------------------

const listCategoriesPublic = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategoriesPublic();
  return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

const getCategoryBySlugPublic = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  return res.status(200).json(new ApiResponse(200, category, "Category fetched successfully"));
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
  getCategoryByIdAdmin,
  listCategoriesAdmin,
  listCategoriesPublic,
  getCategoryBySlugPublic,
};
