// modules/blog-tags/controller/tag.controller.js

const asyncHandler = require("../../../utils/asyncHandler");
const ApiResponse = require("../../../utils/ApiResponse");
const tagService = require("../service/tag.service");
const {
  createTagSchema,
  createTagsBulkSchema,
  updateTagSchema,
  listTagsQuerySchema,
} = require("../validation/tag.validation");

// -- Admin --------------------------------------------------------------

const createTag = asyncHandler(async (req, res) => {
  const { name } = await createTagSchema.validateAsync(req.body);
  const tag = await tagService.createTag({ name, userId: req.user._id });
  return res.status(201).json(new ApiResponse(201, tag, "Tag created successfully"));
});

const createTagsBulk = asyncHandler(async (req, res) => {
  const { names } = await createTagsBulkSchema.validateAsync(req.body);
  const tagIds = await tagService.findOrCreateTagsByName(names, req.user._id);
  return res.status(201).json(new ApiResponse(201, { tagIds }, "Tags resolved successfully"));
});

const updateTag = asyncHandler(async (req, res) => {
  const { name } = await updateTagSchema.validateAsync(req.body);
  const tag = await tagService.updateTag(req.params.id, name);
  return res.status(200).json(new ApiResponse(200, tag, "Tag updated successfully"));
});

const deleteTag = asyncHandler(async (req, res) => {
  await tagService.deleteTag(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Tag deleted successfully"));
});

const listTagsAdmin = asyncHandler(async (req, res) => {
  const query = await listTagsQuerySchema.validateAsync(req.query);
  const result = await tagService.listTagsAdmin(query);
  return res.status(200).json(new ApiResponse(200, result, "Tags fetched successfully"));
});

// -- Public ---------------------------------------------------------------

const listPopularTags = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const tags = await tagService.listPopularTags(limit);
  return res.status(200).json(new ApiResponse(200, tags, "Tags fetched successfully"));
});

const getTagBySlugPublic = asyncHandler(async (req, res) => {
  const tag = await tagService.getTagBySlug(req.params.slug);
  return res.status(200).json(new ApiResponse(200, tag, "Tag fetched successfully"));
});

module.exports = {
  createTag,
  createTagsBulk,
  updateTag,
  deleteTag,
  listTagsAdmin,
  listPopularTags,
  getTagBySlugPublic,
};
