// modules/shared/helpers/slug.helper.js
// -----------------------------------------------------------------------------
// Generic, model-agnostic slug helper. Any module (blogs, blog-categories,
// blog-tags, and future modules) can reuse this instead of writing their own
// slugify + uniqueness-check logic. Does NOT import any specific model, so
// there is zero coupling between modules.
// -----------------------------------------------------------------------------

const slugify = (text = "") => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const generateUniqueSlug = async (Model, sourceText, excludeId = null, field = "slug") => {
  const baseSlug = slugify(sourceText);

  if (!baseSlug) {
    throw new Error("Cannot generate slug from empty text");
  }

  let candidateSlug = baseSlug;
  let suffix = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { [field]: candidateSlug };
    if (excludeId) query._id = { $ne: excludeId };

    const existing = await Model.findOne(query).select("_id").lean();

    if (!existing) return candidateSlug;

    candidateSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

module.exports = { slugify, generateUniqueSlug };
