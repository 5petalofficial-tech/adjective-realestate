// modules/blogs/controller/blog.controller.js

const asyncHandler = require("../../../utils/asyncHandler");
const ApiResponse = require("../../../utils/ApiResponse");
const blogService = require("../service/blog.service");
const {
  createBlogSchema,
  updateBlogSchema,
  changeStatusSchema,
  toggleFlagSchema,
  publicListQuerySchema,
  adminListQuerySchema,
  searchQuerySchema,
} = require("../validation/blog.validation");

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

const createBlog = asyncHandler(async (req, res) => {
  const payload = await createBlogSchema.validateAsync(req.body);
  const blog = await blogService.createBlog({
    payload,
    featuredImageFile: req.files?.featuredImage?.[0] || null,
    galleryFiles: req.files?.gallery || [],
    userId: req.user._id,
  });
  return res.status(201).json(new ApiResponse(201, blog, "Blog created successfully"));
});

const updateBlog = asyncHandler(async (req, res) => {
  const payload = await updateBlogSchema.validateAsync(req.body);
  const blog = await blogService.updateBlog({
    id: req.params.id,
    payload,
    featuredImageFile: req.files?.featuredImage?.[0] || null,
    galleryFiles: req.files?.gallery,
    userId: req.user._id,
  });
  return res.status(200).json(new ApiResponse(200, blog, "Blog updated successfully"));
});

const changeStatus = asyncHandler(async (req, res) => {
  const { status, publishDate } = await changeStatusSchema.validateAsync(req.body);
  const blog = await blogService.changeBlogStatus({
    id: req.params.id,
    status,
    publishDate,
    userId: req.user._id,
  });
  return res.status(200).json(new ApiResponse(200, blog, `Blog status updated to '${status}'`));
});

const toggleFeatured = asyncHandler(async (req, res) => {
  const { value } = await toggleFlagSchema.validateAsync(req.body);
  const blog = await blogService.toggleFeatured(req.params.id, value);
  return res.status(200).json(new ApiResponse(200, blog, "Blog featured flag updated"));
});

const toggleTrending = asyncHandler(async (req, res) => {
  const { value } = await toggleFlagSchema.validateAsync(req.body);
  const blog = await blogService.toggleTrending(req.params.id, value);
  return res.status(200).json(new ApiResponse(200, blog, "Blog trending flag updated"));
});

const deleteBlog = asyncHandler(async (req, res) => {
  await blogService.deleteBlog(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Blog deleted successfully"));
});

const duplicateBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.duplicateBlog(req.params.id, req.user._id);
  return res.status(201).json(new ApiResponse(201, blog, "Blog duplicated successfully"));
});

const getBlogByIdAdmin = asyncHandler(async (req, res) => {
  const blog = await blogService.getBlogByIdAdmin(req.params.id);
  return res.status(200).json(new ApiResponse(200, blog, "Blog fetched successfully"));
});

const listBlogsAdmin = asyncHandler(async (req, res) => {
  const query = await adminListQuerySchema.validateAsync(req.query);
  const result = await blogService.listBlogsAdmin(query);
  return res.status(200).json(new ApiResponse(200, result, "Blogs fetched successfully"));
});

/** Admin "Preview" action — reuses the public slug-fetch but bypasses the
 *  published/scheduled visibility filter so drafts can be previewed.
 *  Kept in the admin controller since it needs the same rich fetch as the
 *  public detail page (populated category/tags/author/relatedProperties). */
const previewBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.getBlogByIdAdmin(req.params.id);
  return res.status(200).json(new ApiResponse(200, blog, "Blog preview fetched successfully"));
});

// ---------------------------------------------------------------------------
// Public
// ---------------------------------------------------------------------------

const listBlogsPublic = asyncHandler(async (req, res) => {
  const query = await publicListQuerySchema.validateAsync(req.query);
  const result = await blogService.listBlogsPublic(query);
  return res.status(200).json(new ApiResponse(200, result, "Blogs fetched successfully"));
});

const getFeaturedBlogs = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 6;
  const blogs = await blogService.getFeaturedBlogs(limit);
  return res.status(200).json(new ApiResponse(200, blogs, "Featured blogs fetched successfully"));
});

const getTrendingBlogs = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 6;
  const blogs = await blogService.getTrendingBlogs(limit);
  return res.status(200).json(new ApiResponse(200, blogs, "Trending blogs fetched successfully"));
});

const searchBlogs = asyncHandler(async (req, res) => {
  const query = await searchQuerySchema.validateAsync(req.query);
  const result = await blogService.searchBlogs(query);
  return res.status(200).json(new ApiResponse(200, result, "Search results fetched successfully"));
});

const getBlogBySlugPublic = asyncHandler(async (req, res) => {
  const blog = await blogService.getBlogBySlugPublic(req.params.slug);
  const relatedBlogs = await blogService.getRelatedBlogs(blog);
  return res.status(200).json(new ApiResponse(200, { blog, relatedBlogs }, "Blog fetched successfully"));
});

module.exports = {
  // admin
  createBlog,
  updateBlog,
  changeStatus,
  toggleFeatured,
  toggleTrending,
  deleteBlog,
  duplicateBlog,
  getBlogByIdAdmin,
  listBlogsAdmin,
  previewBlog,
  // public
  listBlogsPublic,
  getFeaturedBlogs,
  getTrendingBlogs,
  searchBlogs,
  getBlogBySlugPublic,
};
