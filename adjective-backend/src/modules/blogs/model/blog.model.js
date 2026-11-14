// modules/blogs/model/blog.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { generateUniqueSlug } = require("../../shared/helpers/slug.helper");
const { calculateReadTime } = require("../helpers/readTime.helper");

const contentBlockSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["heading", "paragraph", "list", "table", "image", "quote", "code", "video"],
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    caption: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const seoSchema = new Schema(
  {
    seoTitle: { type: String, trim: true, maxlength: 70, default: "" },
    seoDescription: { type: String, trim: true, maxlength: 160, default: "" },
    seoKeywords: [{ type: String, trim: true }],
    canonicalURL: { type: String, trim: true, default: "" },
    ogImage: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },

    content: {
      type: [contentBlockSchema],
      required: true,
      validate: {
        validator: (blocks) => Array.isArray(blocks) && blocks.length > 0,
        message: "Blog content must contain at least one block",
      },
    },

    featuredImage: {
      type: imageSchema,
      required: [true, "Featured image is required"],
    },

    gallery: {
      type: [imageSchema],
      default: [],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: [true, "Category is required"],
      index: true,
    },

    tags: {
      type: [{ type: Schema.Types.ObjectId, ref: "BlogTag" }],
      default: [],
      index: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived", "scheduled"],
      default: "draft",
      index: true,
    },

    publishDate: {
      type: Date,
      default: null,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isTrending: {
      type: Boolean,
      default: false,
      index: true,
    },

    readTime: {
      type: Number,
      default: 1,
      min: 1,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    bookmarksCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    seo: {
      type: seoSchema,
      default: () => ({}),
    },

    relatedProperties: {
      type: [{ type: Schema.Types.ObjectId, ref: "Property" }],
      default: [],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ status: 1, isDeleted: 1, publishDate: -1 });
blogSchema.index({ category: 1, status: 1, publishDate: -1 });
blogSchema.index({ tags: 1, status: 1, publishDate: -1 });
blogSchema.index({ isFeatured: 1, status: 1, publishDate: -1 });
blogSchema.index({ isTrending: 1, status: 1, publishDate: -1 });
blogSchema.index({ views: -1 });
blogSchema.index({ title: "text", excerpt: "text" });

blogSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("title")) {
      this.slug = await generateUniqueSlug(this.constructor, this.title, this._id);
    }

    if (this.isNew || this.isModified("content")) {
      this.readTime = calculateReadTime(this.content);
    }

    if (!this.seo) this.seo = {};
    if (!this.seo.seoTitle) this.seo.seoTitle = this.title;
    if (!this.seo.seoDescription) this.seo.seoDescription = this.excerpt;
    if (!this.seo.ogImage && this.featuredImage?.url) {
      this.seo.ogImage = this.featuredImage.url;
    }

    if (this.status === "published" && !this.publishDate) {
      this.publishDate = new Date();
    }

    next();
  } catch (error) {
    next(error);
  }
});

blogSchema.query.publiclyVisible = function () {
  return this.where({
    isDeleted: false,
    $or: [
      { status: "published" },
      { status: "scheduled", publishDate: { $lte: new Date() } },
    ],
  });
};

module.exports = mongoose.model("Blog", blogSchema);
