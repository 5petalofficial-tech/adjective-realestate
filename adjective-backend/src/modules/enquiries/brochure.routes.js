const express = require("express");
const router = express.Router();
const { sendBrochureOtp, verifyBrochureOtp } = require("./brochure.controller");

router.post("/send-otp", sendBrochureOtp);
router.post("/verify-otp", verifyBrochureOtp);

module.exports = router;
