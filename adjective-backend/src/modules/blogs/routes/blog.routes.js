// modules/blogs/routes/blog.routes.js
// Public routes — mounted at /api/blogs
// NOTE: static-path routes (/featured, /trending, /search) MUST be
// registered before the dynamic /:slug route, otherwise Express will treat
// "featured" as a slug value and it'll hit getBlogBySlugPublic instead.

const express = require("express");
const router = express.Router();
const controller = require("../controller/blog.controller");

router.get("/", controller.listBlogsPublic);
router.get("/featured", controller.getFeaturedBlogs);
router.get("/trending", controller.getTrendingBlogs);
router.get("/search", controller.searchBlogs);
router.get("/:slug", controller.getBlogBySlugPublic);

module.exports = router;
