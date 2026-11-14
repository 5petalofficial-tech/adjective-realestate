const { dispatchOTP, verifyOTP } = require("../auth/auth.service");
const axios = require("axios");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
const Enquiry = require("./enquiry.model")

const sendBrochureOtp = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw ApiError.badRequest("Name and email are required");
  }
  await dispatchOTP({ identifier: email.toLowerCase().trim(), purpose: "brochure_verify" });
  res.status(200).json(new ApiResponse(200, null, `OTP sent to ${email}`));
});

const verifyBrochureOtp = asyncHandler(async (req, res) => {
  const { email, otp, name, phone, propertyName, verificationMethod, firebaseIdToken } = req.body;
  if (!otp || (!email && verificationMethod !== "phone")) {
    throw ApiError.badRequest("An email or verified mobile number is required");
  }
  if (verificationMethod !== "phone") {
    await verifyOTP({ identifier: email.toLowerCase().trim(), otp, purpose: "brochure_verify" });
  } else {
    if (!firebaseIdToken || !phone || !process.env.FIREBASE_WEB_API_KEY) {
      throw ApiError.badRequest("Mobile verification could not be confirmed");
    }
    try {
      const { data } = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_WEB_API_KEY}`,
        { idToken: firebaseIdToken }
      );
      if (data.users?.[0]?.phoneNumber !== phone) {
        throw new Error("Phone number mismatch");
      }
    } catch {
      throw ApiError.unauthorized("Mobile verification could not be confirmed");
    }
  }
  if (name && phone) {
    const enquiry = new Enquiry(
      {
        name,
        email: email?.toLowerCase().trim() || null,
        phone,
        enquiryType: "Brochure Download",
        propertyName: propertyName || "",
        message: `Download property ${propertyName} brochure via verified ${verificationMethod === "phone" ? "mobile number" : "email"}.`
      }
    );
    await enquiry.save();
  }
  
  res.status(200).json(new ApiResponse(200, null, "Contact verified. Brochure access granted."));
});

module.exports = { sendBrochureOtp, verifyBrochureOtp };
