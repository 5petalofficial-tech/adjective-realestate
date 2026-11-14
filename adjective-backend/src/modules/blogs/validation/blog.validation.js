// modules/blogs/validation/blog.validation.js

const Joi = require("joi");
const objectId = Joi.string().hex().length(24);

const blockDataSchemas = {
  heading: Joi.object({
    text: Joi.string().trim().min(1).required(),
    level: Joi.number().integer().min(1).max(6).default(2),
  }),
  paragraph: Joi.object({
    text: Joi.string().trim().min(1).required(),
  }),
  list: Joi.object({
    style: Joi.string().valid("ordered", "unordered").default("unordered"),
    items: Joi.array().items(Joi.string().trim().min(1)).min(1).required(),
  }),
  table: Joi.object({
    headers: Joi.array().items(Joi.string().trim().allow("")),
    rows: Joi.array().items(Joi.array().items(Joi.string().trim().allow(""))).required(),
  }),
  image: Joi.object({
    url: Joi.string().uri().required(),
    publicId: Joi.string().required(),
    caption: Joi.string().trim().allow(""),
    alt: Joi.string().trim().allow(""),
  }),
  quote: Joi.object({
    text: Joi.string().trim().min(1).required(),
    author: Joi.string().trim().allow(""),
  }),
  code: Joi.object({
    code: Joi.string().required(),
    language: Joi.string().trim().default("plaintext"),
  }),
  video: Joi.object({
    embedUrl: Joi.string().uri().required(),
    provider: Joi.string().valid("youtube", "vimeo", "other").default("other"),
    caption: Joi.string().trim().allow(""),
  }),
};

const contentBlockSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.keys(blockDataSchemas))
    .required(),
  data: Joi.when("type", {
    switch: Object.keys(blockDataSchemas).map((type) => ({
      is: type,
      then: blockDataSchemas[type],
    })),
  }).required(),
});

const seoSchema = Joi.object({
  seoTitle: Joi.string().trim().max(70).allow(""),
  seoDescription: Joi.string().trim().max(160).allow(""),
  seoKeywords: Joi.array().items(Joi.string().trim()),
  canonicalURL: Joi.string().uri().allow(""),
  ogImage: Joi.string().uri().allow(""),
});

const createBlogSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).required(),
  excerpt: Joi.string().trim().min(10).max(300).required(),
  content: Joi.array().items(contentBlockSchema).min(1).required(),

  category: objectId.required(),
  tags: Joi.array().items(objectId).default([]),

  status: Joi.string().valid("draft", "published", "archived", "scheduled").default("draft"),
  publishDate: Joi.date().iso().when("status", {
    is: "scheduled",
    then: Joi.date().required().greater("now").messages({
      "date.greater": "publishDate must be in the future when status is 'scheduled'",
    }),
    otherwise: Joi.optional(),
  }),

  isFeatured: Joi.boolean().default(false),
  isTrending: Joi.boolean().default(false),

  seo: seoSchema,
  relatedProperties: Joi.array().items(objectId).default([]),
});

const updateBlogSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200),
  excerpt: Joi.string().trim().min(10).max(300),
  content: Joi.array().items(contentBlockSchema).min(1),

  category: objectId,
  tags: Joi.array().items(objectId),

  status: Joi.string().valid("draft", "published", "archived", "scheduled"),
  publishDate: Joi.date().iso(),

  isFeatured: Joi.boolean(),
  isTrending: Joi.boolean(),

  seo: seoSchema,
  relatedProperties: Joi.array().items(objectId),
}).min(1);

const changeStatusSchema = Joi.object({
  status: Joi.string().valid("draft", "published", "archived", "scheduled").required(),
  publishDate: Joi.date().iso().when("status", {
    is: "scheduled",
    then: Joi.date().required().greater("now"),
    otherwise: Joi.optional(),
  }),
});

const toggleFlagSchema = Joi.object({
  value: Joi.boolean().required(),
});

const publicListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
  category: Joi.string().trim(),
  tag: Joi.string().trim(),
  author: objectId,
  featured: Joi.boolean(),
  trending: Joi.boolean(),
  sortBy: Joi.string().valid("newest", "oldest", "mostViewed", "popular").default("newest"),
});

const adminListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid("draft", "published", "archived", "scheduled"),
  category: objectId,
  tag: objectId,
  author: objectId,
  featured: Joi.boolean(),
  trending: Joi.boolean(),
  search: Joi.string().trim().allow(""),
  dateFrom: Joi.date().iso(),
  dateTo: Joi.date().iso().min(Joi.ref("dateFrom")),
  sortBy: Joi.string().valid("newest", "oldest", "mostViewed", "title").default("newest"),
});

const searchQuerySchema = Joi.object({
  q: Joi.string().trim().min(1).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
});

const blogIdParamSchema = Joi.object({
  id: objectId.required(),
});

const blogSlugParamSchema = Joi.object({
  slug: Joi.string().trim().lowercase().required(),
});

module.exports = {
  createBlogSchema,
  updateBlogSchema,
  changeStatusSchema,
  toggleFlagSchema,
  publicListQuerySchema,
  adminListQuerySchema,
  searchQuerySchema,
  blogIdParamSchema,
  blogSlugParamSchema,
};
