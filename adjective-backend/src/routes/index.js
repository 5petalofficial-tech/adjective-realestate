const express = require('express');
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require('../modules/users/user.routes');
const soloRoutes = require('../modules/properties/solo.routes');
const dealerRoutes = require('../modules/properties/dealer.routes');
const enquiryRoutes = require('../modules/enquiries/enquiry.routes');
const locationRoutes = require('../modules/location/location.routes');
const brochureRoutes = require('../modules/enquiries/brochure.routes');

// Blog routes (Admin)
const blogAdminRoutes = require("../modules/blogs/routes/blog.admin.routes");
const categoryAdminRoutes = require("../modules/blog-categories/routes/category.admin.routes");
const tagAdminRoutes = require("../modules/blog-tags/routes/tag.admin.routes");

// Blog routes (Public)
const blogPublicRoutes = require("../modules/blogs/routes/blog.routes");
const categoryPublicRoutes = require("../modules/blog-categories/routes/category.routes");
const tagPublicRoutes = require("../modules/blog-tags/routes/tag.routes");

router.use("/auth", authRoutes);
router.use('/users', userRoutes);
router.use('/user', userRoutes);
router.use('/solo', soloRoutes);
router.use('/dealer', dealerRoutes);
router.use('/location', locationRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/enquiry', enquiryRoutes);
router.use('/brochure', brochureRoutes);

// Admin Blog endpoints
router.use('/admin/blogs', blogAdminRoutes);
router.use('/admin/blog-categories', categoryAdminRoutes);
router.use('/admin/blog-tags', tagAdminRoutes);

// Public Blog endpoints
router.use('/blogs', blogPublicRoutes);
router.use('/blog-categories', categoryPublicRoutes);
router.use('/blog-tags', tagPublicRoutes);

module.exports = router;
