// modules/blog-categories/routes/category.routes.js
// Public routes — mounted at /api/blog-categories

const express = require("express");
const router = express.Router();
const controller = require("../controller/category.controller");

router.get("/", controller.listCategoriesPublic);
router.get("/:slug", controller.getCategoryBySlugPublic);

module.exports = router;
