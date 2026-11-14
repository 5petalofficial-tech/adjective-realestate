// modules/blogs/routes/blog.admin.routes.js
// Admin routes — mounted at /api/admin/blogs

const express = require("express");
const router = express.Router();
const controller = require("../controller/blog.controller");
const { protect, authorize } = require("../../../middlewares/auth.middleware");
const { upload } = require("../../../middlewares/upload.middleware");

// author: can create/edit their own drafts. editor: can edit/publish any
// blog. admin: full control, including delete. Fine-grained "own blog only"
// ownership checks for authors belong in the service layer (req.user._id
// vs blog.author) — add there if/when multi-author is enabled.
router.use(protect, authorize("admin", "editor", "author"));

const blogImageUpload = upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

router.get("/", controller.listBlogsAdmin);
router.get("/:id", controller.getBlogByIdAdmin);
router.get("/:id/preview", controller.previewBlog);
router.post("/", blogImageUpload, controller.createBlog);
router.patch("/:id", blogImageUpload, controller.updateBlog);
router.patch("/:id/status", authorize("admin", "editor"), controller.changeStatus);
router.patch("/:id/feature", authorize("admin", "editor"), controller.toggleFeatured);
router.patch("/:id/trending", authorize("admin", "editor"), controller.toggleTrending);
router.post("/:id/duplicate", authorize("admin", "editor"), controller.duplicateBlog);
router.delete("/:id", authorize("admin", "editor"), controller.deleteBlog);

module.exports = router;
