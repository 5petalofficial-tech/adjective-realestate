// modules/blogs/service/blog.service.js
// -----------------------------------------------------------------------------
// Core Blog CMS service. Same import-path assumption as category/tag
// services: shared/utils/{apiError, paginate.helper, cloudinary.util} —
// adjust these three lines if your actual filenames differ.
// -----------------------------------------------------------------------------

const Blog = require("../model/blog.model");
const BlogCategory = require("../../blog-categories/model/category.model");
const BlogTag = require("../../blog-tags/model/tag.model");
const ApiError = require("../../../utils/ApiError");
const { paginate } = require("../../../utils/paginate.helper");
const storage = require("../../../utils/storage");

const CLOUDINARY_FOLDER = "adjective/blogs";
const POPULATE_FIELDS = [
  { path: "category", select: "name slug" },
  { path: "tags", select: "name slug" },
  { path: "author", select: "name email avatar" },
];

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Verify category exists & is not deleted; throws 400 otherwise. */
const assertCategoryExists = async (categoryId) => {
  const category = await BlogCategory.findOne({ _id: categoryId, isDeleted: false });
  if (!category) throw new ApiError(400, "Selected category does not exist");
  return category;
};

/** Verify every tag id exists & is not deleted; throws 400 listing the bad ones. */
const assertTagsExist = async (tagIds = []) => {
  if (tagIds.length === 0) return;
  const found = await BlogTag.find({ _id: { $in: tagIds }, isDeleted: false }).select("_id");
  if (found.length !== tagIds.length) {
    throw new ApiError(400, "One or more selected tags do not exist");
  }
};

const incrementCategoryCount = (categoryId, delta) =>
  BlogCategory.updateOne({ _id: categoryId }, { $inc: { blogsCount: delta } }).exec();

const incrementTagsCount = (tagIds = [], delta) => {
  if (tagIds.length === 0) return Promise.resolve();
  return BlogTag.updateMany({ _id: { $in: tagIds } }, { $inc: { blogsCount: delta } }).exec();
};

/**
 * Diff two tag-id arrays so an update only touches counts for what actually
 * changed, instead of decrementing everything and re-incrementing.
 */
const diffTagIds = (oldIds = [], newIds = []) => {
  const oldSet = new Set(oldIds.map(String));
  const newSet = new Set(newIds.map(String));
  return {
    added: newIds.filter((id) => !oldSet.has(String(id))),
    removed: oldIds.filter((id) => !newSet.has(String(id))),
  };
};

const uploadBlogImage = (file) => storage.upload(file.buffer, { folder: CLOUDINARY_FOLDER });

const SORT_MAP = {
  newest: { publishDate: -1, createdAt: -1 },
  oldest: { publishDate: 1, createdAt: 1 },
  mostViewed: { views: -1 },
  popular: { likesCount: -1, views: -1 },
  title: { title: 1 },
};

// ---------------------------------------------------------------------------
// Search abstraction — Mongo text index today, swappable for
// Algolia/Elasticsearch later without touching controllers or this file's
// public exports (only the body of `search()` would change).
// ---------------------------------------------------------------------------
const searchProvider = {
  async search(query, { page, limit }) {
    // publiclyVisible()'s filter shape, inlined here since a plain filter
    // object (not a query builder) is what paginate()/text-search need.
    const filter = {
      $text: { $search: query },
      isDeleted: false,
      $or: [
        { status: "published" },
        { status: "scheduled", publishDate: { $lte: new Date() } },
      ],
    };

    return paginate(Blog, filter, {
      page,
      limit,
      sort: { score: { $meta: "textScore" } },
      projection: { score: { $meta: "textScore" } },
      populate: POPULATE_FIELDS,
    });
  },
};

// ---------------------------------------------------------------------------
// CREATE
// ---------------------------------------------------------------------------
const createBlog = async ({ payload, featuredImageFile, galleryFiles = [], userId }) => {
  if (!featuredImageFile) {
    throw new ApiError(400, "Featured image is required");
  }

  await assertCategoryExists(payload.category);
  await assertTagsExist(payload.tags || []);

  const uploadedFeatured = await uploadBlogImage(featuredImageFile);
  const uploadedGallery = await Promise.all(galleryFiles.map(uploadBlogImage));

  const blog = await Blog.create({
    ...payload,
    featuredImage: { url: uploadedFeatured.url, publicId: uploadedFeatured.publicId },
    gallery: uploadedGallery.map((img) => ({ url: img.url, publicId: img.publicId })),
    author: payload.author || userId, // allow admin to assign a different author later; defaults to creator
    createdBy: userId,
  });

  await Promise.all([
    incrementCategoryCount(blog.category, 1),
    incrementTagsCount(blog.tags, 1),
  ]);

  return blog.populate(POPULATE_FIELDS);
};

// ---------------------------------------------------------------------------
// UPDATE
// ---------------------------------------------------------------------------
const updateBlog = async ({ id, payload, featuredImageFile, galleryFiles = [], removeGalleryPublicIds = [], userId }) => {
  const blog = await Blog.findOne({ _id: id, isDeleted: false });
  if (!blog) throw new ApiError(404, "Blog not found");

  if (payload.category && String(payload.category) !== String(blog.category)) {
    await assertCategoryExists(payload.category);
  }
  if (payload.tags) {
    await assertTagsExist(payload.tags);
  }

  const previousCategory = String(blog.category);
  const previousTagIds = blog.tags.map(String);

  // --- featured image replace ---
  let previousFeaturedPublicId = null;
  if (featuredImageFile) {
    const uploaded = await uploadBlogImage(featuredImageFile);
    previousFeaturedPublicId = blog.featuredImage?.publicId || null;
    blog.featuredImage = { url: uploaded.url, publicId: uploaded.publicId };
  }

  // --- gallery: remove requested images, add new ones ---
  const publicIdsToDelete = [];
  if (removeGalleryPublicIds.length > 0) {
    blog.gallery = blog.gallery.filter((img) => {
      const shouldRemove = removeGalleryPublicIds.includes(img.publicId);
      if (shouldRemove) publicIdsToDelete.push(img.publicId);
      return !shouldRemove;
    });
  }
  if (galleryFiles.length > 0) {
    const uploadedGallery = await Promise.all(galleryFiles.map(uploadBlogImage));
    blog.gallery.push(...uploadedGallery.map((img) => ({ url: img.url, publicId: img.publicId })));
  }

  Object.assign(blog, payload, { updatedBy: userId });
  await blog.save();

  // --- sync category/tag counts if they changed ---
  const tasks = [];
  if (payload.category && String(payload.category) !== previousCategory) {
    tasks.push(incrementCategoryCount(previousCategory, -1));
    tasks.push(incrementCategoryCount(payload.category, 1));
  }
  if (payload.tags) {
    const { added, removed } = diffTagIds(previousTagIds, payload.tags);
    tasks.push(incrementTagsCount(added, 1));
    tasks.push(incrementTagsCount(removed, -1));
  }
  await Promise.all(tasks);

  // --- cleanup orphaned Cloudinary assets, fire-and-forget ---
  if (previousFeaturedPublicId) {
    storage.remove(previousFeaturedPublicId).catch((err) =>
      console.error(`Failed to delete old featured image ${previousFeaturedPublicId}:`, err.message)
    );
  }
  publicIdsToDelete.forEach((publicId) => {
    storage.remove(publicId).catch((err) =>
      console.error(`Failed to delete gallery image ${publicId}:`, err.message)
    );
  });

  return blog.populate(POPULATE_FIELDS);
};

// ---------------------------------------------------------------------------
// DELETE / RESTORE / DUPLICATE
// ---------------------------------------------------------------------------
const deleteBlog = async (id) => {
  const blog = await Blog.findOne({ _id: id, isDeleted: false });
  if (!blog) throw new ApiError(404, "Blog not found");

  blog.isDeleted = true;
  blog.deletedAt = new Date();
  await blog.save();

  await Promise.all([
    incrementCategoryCount(blog.category, -1),
    incrementTagsCount(blog.tags, -1),
  ]);

  return blog;
};

const restoreBlog = async (id) => {
  const blog = await Blog.findOne({ _id: id, isDeleted: true });
  if (!blog) throw new ApiError(404, "Deleted blog not found");

  blog.isDeleted = false;
  blog.deletedAt = null;
  await blog.save();

  await Promise.all([
    incrementCategoryCount(blog.category, 1),
    incrementTagsCount(blog.tags, 1),
  ]);

  return blog;
};

const duplicateBlog = async (id, userId) => {
  const original = await Blog.findOne({ _id: id, isDeleted: false }).lean();
  if (!original) throw new ApiError(404, "Blog not found");

  // strip fields that must be regenerated / reset for the copy
  const {
    _id,
    slug,
    views,
    bookmarksCount,
    likesCount,
    createdAt,
    updatedAt,
    publishDate,
    ...rest
  } = original;

  const duplicate = await Blog.create({
    ...rest,
    title: `${original.title} (Copy)`,
    status: "draft",
    publishDate: null,
    views: 0,
    bookmarksCount: 0,
    likesCount: 0,
    createdBy: userId,
    updatedBy: null,
  });

  await Promise.all([
    incrementCategoryCount(duplicate.category, 1),
    incrementTagsCount(duplicate.tags, 1),
  ]);

  return duplicate.populate(POPULATE_FIELDS);
};

// ---------------------------------------------------------------------------
// STATUS / FLAGS
// ---------------------------------------------------------------------------
const changeStatus = async (id, { status, publishDate }, userId) => {
  const blog = await Blog.findOne({ _id: id, isDeleted: false });
  if (!blog) throw new ApiError(404, "Blog not found");

  blog.status = status;
  if (status === "scheduled") blog.publishDate = publishDate;
  blog.updatedBy = userId;
  await blog.save();

  return blog.populate(POPULATE_FIELDS);
};

const toggleFeature = async (id, value, userId) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isFeatured: value, updatedBy: userId },
    { new: true }
  ).populate(POPULATE_FIELDS);
  if (!blog) throw new ApiError(404, "Blog not found");
  return blog;
};

const toggleTrending = async (id, value, userId) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isTrending: value, updatedBy: userId },
    { new: true }
  ).populate(POPULATE_FIELDS);
  if (!blog) throw new ApiError(404, "Blog not found");
  return blog;
};

// ---------------------------------------------------------------------------
// VIEWS — atomic increment, never read-modify-write the full document
// ---------------------------------------------------------------------------
const incrementViews = (slug) =>
  Blog.updateOne({ slug, isDeleted: false }, { $inc: { views: 1 } }).exec();

// ---------------------------------------------------------------------------
// READ — single blog
// ---------------------------------------------------------------------------
const getBlogBySlugPublic = async (slug) => {
  const blog = await Blog.findOne({ slug }).publiclyVisible().populate(POPULATE_FIELDS);
  if (!blog) throw new ApiError(404, "Blog not found");

  // fire-and-forget — don't block the response on the view counter
  incrementViews(slug).catch((err) => console.error("View increment failed:", err.message));

  return blog;
};

const getBlogByIdAdmin = async (id) => {
  const blog = await Blog.findOne({ _id: id, isDeleted: false }).populate(POPULATE_FIELDS);
  if (!blog) throw new ApiError(404, "Blog not found");
  return blog;
};

// ---------------------------------------------------------------------------
// READ — listings
// ---------------------------------------------------------------------------
const listBlogsPublic = async ({ page, limit, category, tag, author, featured, trending, sortBy }) => {
  let query = Blog.find().publiclyVisible();

  if (category) {
    const cat = await BlogCategory.findOne({ slug: category, isDeleted: false }).select("_id");
    query = cat ? query.where({ category: cat._id }) : query.where({ category: null }); // no match -> empty result
  }
  if (tag) {
    const tagDoc = await BlogTag.findOne({ slug: tag, isDeleted: false }).select("_id");
    query = tagDoc ? query.where({ tags: tagDoc._id }) : query.where({ tags: null });
  }
  if (author) query = query.where({ author });
  if (featured !== undefined) query = query.where({ isFeatured: featured });
  if (trending !== undefined) query = query.where({ isTrending: trending });

  return paginate(Blog, query.getQuery(), {
    page,
    limit,
    sort: SORT_MAP[sortBy] || SORT_MAP.newest,
    populate: POPULATE_FIELDS,
  });
};

const listBlogsAdmin = async ({
  page,
  limit,
  status,
  category,
  tag,
  author,
  featured,
  trending,
  search,
  dateFrom,
  dateTo,
  sortBy,
}) => {
  const filter = { isDeleted: false };

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (author) filter.author = author;
  if (featured !== undefined) filter.isFeatured = featured;
  if (trending !== undefined) filter.isTrending = trending;
  if (search) filter.$text = { $search: search };
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  return paginate(Blog, filter, {
    page,
    limit,
    sort: SORT_MAP[sortBy] || SORT_MAP.newest,
    populate: POPULATE_FIELDS,
  });
};

const getFeaturedBlogs = (limit = 6) =>
  Blog.find().publiclyVisible().where({ isFeatured: true })
    .sort({ publishDate: -1 })
    .limit(limit)
    .populate(POPULATE_FIELDS)
    .lean();

const getTrendingBlogs = (limit = 6) =>
  Blog.find().publiclyVisible().where({ isTrending: true })
    .sort({ views: -1 })
    .limit(limit)
    .populate(POPULATE_FIELDS)
    .lean();

/** Same category OR overlapping tags, excluding the current blog. */
const getRelatedBlogs = async (blogId, limit = 4) => {
  const current = await Blog.findById(blogId).select("category tags");
  if (!current) return [];

  return Blog.find()
    .publiclyVisible()
    .where({
      _id: { $ne: blogId },
      $or: [{ category: current.category }, { tags: { $in: current.tags } }],
    })
    .sort({ publishDate: -1 })
    .limit(limit)
    .populate(POPULATE_FIELDS)
    .lean();
};

const searchBlogs = ({ q, page, limit }) => searchProvider.search(q, { page, limit });

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  restoreBlog,
  duplicateBlog,
  changeStatus,
  toggleFeature,
  toggleTrending,
  incrementViews,
  getBlogBySlugPublic,
  getBlogByIdAdmin,
  listBlogsPublic,
  listBlogsAdmin,
  getFeaturedBlogs,
  getTrendingBlogs,
  getRelatedBlogs,
  searchBlogs,
};
