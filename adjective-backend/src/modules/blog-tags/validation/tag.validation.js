// modules/blog-tags/validation/tag.validation.js

const Joi = require("joi");

const createTagSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
});

const createTagsBulkSchema = Joi.object({
  names: Joi.array().items(Joi.string().trim().min(2).max(50)).min(1).max(30).required(),
});

const updateTagSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
});

const listTagsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
  search: Joi.string().trim().allow(""),
  sortBy: Joi.string().valid("name", "blogsCount", "createdAt").default("blogsCount"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});

const tagIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const tagSlugParamSchema = Joi.object({
  slug: Joi.string().trim().lowercase().required(),
});

module.exports = {
  createTagSchema,
  createTagsBulkSchema,
  updateTagSchema,
  listTagsQuerySchema,
  tagIdParamSchema,
  tagSlugParamSchema,
};
