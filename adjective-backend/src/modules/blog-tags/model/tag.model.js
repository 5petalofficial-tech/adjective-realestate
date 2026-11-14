// modules/blog-tags/model/tag.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { generateUniqueSlug } = require("../../shared/helpers/slug.helper");

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      maxlength: [50, "Tag name cannot exceed 50 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
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

tagSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);
tagSchema.index({ isDeleted: 1, blogsCount: -1 });

tagSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("name")) {
      this.slug = await generateUniqueSlug(this.constructor, this.name, this._id);
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("BlogTag", tagSchema);
