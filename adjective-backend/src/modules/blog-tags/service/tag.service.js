// modules/blog-tags/service/tag.service.js

const Tag = require("../model/tag.model");
const ApiError = require("../../../utils/ApiError");
const { paginate } = require("../../../utils/paginate.helper");

const createTag = async ({ name, userId }) => {
  const existing = await Tag.findOne({ name }).collation({ locale: "en", strength: 2 });
  if (existing && !existing.isDeleted) {
    throw new ApiError(409, `Tag "${name}" already exists`);
  }
  if (existing && existing.isDeleted) {
    existing.isDeleted = false;
    existing.deletedAt = null;
    await existing.save();
    return existing;
  }

  return Tag.create({ name, createdBy: userId });
};

const findOrCreateTagsByName = async (names = [], userId) => {
  const uniqueNames = [...new Set(names.map((n) => n.trim()).filter(Boolean))];

  const tagIds = await Promise.all(
    uniqueNames.map(async (name) => {
      let tag = await Tag.findOne({ name, isDeleted: false }).collation({
        locale: "en",
        strength: 2,
      });
      if (!tag) {
        tag = await Tag.create({ name, createdBy: userId });
      }
      return tag._id;
    })
  );

  return tagIds;
};

const updateTag = async (id, name) => {
  const tag = await Tag.findOne({ _id: id, isDeleted: false });
  if (!tag) throw new ApiError(404, "Tag not found");

  const duplicate = await Tag.findOne({
    _id: { $ne: id },
    name,
    isDeleted: false,
  }).collation({ locale: "en", strength: 2 });
  if (duplicate) throw new ApiError(409, `Tag "${name}" already exists`);

  tag.name = name;
  await tag.save();
  return tag;
};

const deleteTag = async (id) => {
  const tag = await Tag.findOne({ _id: id, isDeleted: false });
  if (!tag) throw new ApiError(404, "Tag not found");

  if (tag.blogsCount > 0) {
    throw new ApiError(
      409,
      `Cannot delete tag used by ${tag.blogsCount} active blog(s). Remove it from those blogs first.`
    );
  }

  tag.isDeleted = true;
  tag.deletedAt = new Date();
  await tag.save();
  return tag;
};

const getTagBySlug = async (slug) => {
  const tag = await Tag.findOne({ slug, isDeleted: false });
  if (!tag) throw new ApiError(404, "Tag not found");
  return tag;
};

const listTagsAdmin = async ({ page, limit, search, sortBy, sortOrder }) => {
  const filter = { isDeleted: false };
  if (search) filter.name = { $regex: search, $options: "i" };

  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  return paginate(Tag, filter, { page, limit, sort });
};

const listPopularTags = async (limit = 20) => {
  return Tag.find({ isDeleted: false, blogsCount: { $gt: 0 } })
    .sort({ blogsCount: -1 })
    .limit(limit)
    .select("name slug blogsCount")
    .lean();
};

module.exports = {
  createTag,
  findOrCreateTagsByName,
  updateTag,
  deleteTag,
  getTagBySlug,
  listTagsAdmin,
  listPopularTags,
};
