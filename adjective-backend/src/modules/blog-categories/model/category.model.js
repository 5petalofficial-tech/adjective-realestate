// modules/blog-categories/model/category.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { generateUniqueSlug } = require("../../shared/helpers/slug.helper");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    seo: {
      seoTitle: { type: String, trim: true, maxlength: 70, default: "" },
      seoDescription: { type: String, trim: true, maxlength: 160, default: "" },
      seoKeywords: [{ type: String, trim: true }],
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    blogsCount: {
      type: Number,
      default: 0,
      min: 0,
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

categorySchema.index({ status: 1, isDeleted: 1, sortOrder: 1 });
categorySchema.index({ name: "text", description: "text" });

categorySchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("name")) {
      this.slug = await generateUniqueSlug(this.constructor, this.name, this._id);
    }
    next();
  } catch (error) {
    next(error);
  }
});

categorySchema.query.active = function () {
  return this.where({ status: "active", isDeleted: false });
};

module.exports = mongoose.model("BlogCategory", categorySchema);
