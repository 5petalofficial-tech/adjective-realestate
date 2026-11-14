/**
 * utils/paginate.helper.js
 *
 * Reusable utility to handle Mongoose pagination query logic.
 * Satisfies the API signature: paginate(Model, filter, options)
 */
const paginate = async (Model, filter = {}, options = {}) => {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const limit = Math.max(1, parseInt(options.limit, 10) || 10);
  const skip = (page - 1) * limit;

  let query = Model.find(filter, options.projection);

  if (options.sort) {
    query = query.sort(options.sort);
  }

  if (options.populate) {
    query = query.populate(options.populate);
  }

  query = query.skip(skip).limit(limit);

  const [docs, total] = await Promise.all([
    query.exec(),
    Model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    docs,
    total,
    page,
    limit,
    totalPages,
  };
};

module.exports = { paginate };
