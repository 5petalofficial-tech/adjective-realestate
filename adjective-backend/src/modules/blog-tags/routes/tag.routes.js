// modules/blog-tags/routes/tag.routes.js
// Public routes — mounted at /api/blog-tags

const express = require("express");
const router = express.Router();
const controller = require("../controller/tag.controller");

router.get("/popular", controller.listPopularTags);
router.get("/:slug", controller.getTagBySlugPublic);

module.exports = router;
