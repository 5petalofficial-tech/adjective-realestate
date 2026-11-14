// modules/blog-categories/validation/category.validation.js

const Joi = require("joi");

const seoSchema = Joi.object({
  seoTitle: Joi.string().trim().max(70).allow(""),
  seoDescription: Joi.string().trim().max(160).allow(""),
  seoKeywords: Joi.array().items(Joi.string().trim()),
});

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().max(500).allow(""),
  seo: seoSchema,
  status: Joi.string().valid("active", "inactive").default("active"),
  sortOrder: Joi.number().integer().min(0).default(0),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().max(500).allow(""),
  seo: seoSchema,
  status: Joi.string().valid("active", "inactive"),
  sortOrder: Joi.number().integer().min(0),
}).min(1);

const listCategoriesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid("active", "inactive"),
  search: Joi.string().trim().allow(""),
  sortBy: Joi.string().valid("name", "sortOrder", "createdAt", "blogsCount").default("sortOrder"),
  sortOrder: Joi.string().valid("asc", "desc").default("asc"),
});

const categoryIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const categorySlugParamSchema = Joi.object({
  slug: Joi.string().trim().lowercase().required(),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  listCategoriesQuerySchema,
  categoryIdParamSchema,
  categorySlugParamSchema,
};
