// modules/blog-categories/routes/category.admin.routes.js
// Admin routes — mounted at /api/admin/blog-categories
// -----------------------------------------------------------------------------
// IMPORT ASSUMPTION: `authenticate` + `authorize(...roles)` (your existing
// JWT middleware) and `upload` (your existing multer instance) live in
// shared/middlewares — adjust paths if named differently.
// -----------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const controller = require("../controller/category.controller");
const { protect, authorize } = require("../../../middlewares/auth.middleware");
const { upload } = require("../../../middlewares/upload.middleware");

router.use(protect, authorize("admin", "editor"));

router.get("/", controller.listCategoriesAdmin);
router.get("/:id", controller.getCategoryByIdAdmin);
router.post("/", upload.single("image"), controller.createCategory);
router.patch("/:id", upload.single("image"), controller.updateCategory);
router.delete("/:id", controller.deleteCategory);
router.patch("/:id/restore", controller.restoreCategory);

module.exports = router;
