// modules/blog-tags/routes/tag.admin.routes.js
// Admin routes — mounted at /api/admin/blog-tags

const express = require("express");
const router = express.Router();
const controller = require("../controller/tag.controller");
const { protect, authorize } = require("../../../middlewares/auth.middleware");

router.use(protect, authorize("admin", "editor", "author"));

router.get("/", controller.listTagsAdmin);
router.post("/", controller.createTag);
router.post("/bulk", controller.createTagsBulk); // used by the blog editor's tag input
router.patch("/:id", authorize("admin", "editor"), controller.updateTag);
router.delete("/:id", authorize("admin", "editor"), controller.deleteTag);

module.exports = router;
