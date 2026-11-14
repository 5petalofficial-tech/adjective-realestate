const nodemailer = require("nodemailer");

/**
 * Single shared transporter. Works with any SMTP provider —
 * Gmail (app password), SendGrid, Mailgun, Amazon SES, etc.
 * Configure via .env — see .env.example.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends an email. Throws on failure so callers can decide how to react
 * (e.g. roll back an OTP record) instead of failing silently.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Adjective Real Estate" <no-reply@adjective.com>`,
    to,
    subject,
    text,
    html,
  });
  return info;
};

const otpEmailTemplate = (otp, purpose = "verify your account") => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background:#FAF8F3; border-radius:12px;">
    <p style="color:#5C6B3E; font-size:12px; letter-spacing:2px; font-weight:600; margin-bottom:24px;">ADJECTIVE REAL ESTATE</p>
    <h2 style="color:#232B1B; margin-bottom:8px;">Your verification code</h2>
    <p style="color:#5B5A47; font-size:14px; margin-bottom:24px;">Use the code below to ${purpose}. This code expires in 5 minutes.</p>
    <div style="background:#fff; border:1px solid #E3DFCF; border-radius:10px; padding:20px; text-align:center; font-size:32px; letter-spacing:8px; font-weight:700; color:#2F3A25;">
      ${otp}
    </div>
    <p style="color:#8B8874; font-size:12px; margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
  </div>
`;

const sendOTPEmail = async (to, otp, purpose) => {
  try {
    return await sendEmail({
      to,
      subject: "Your Adjective verification code",
      html: otpEmailTemplate(otp, purpose),
      text: `Your Adjective verification code is ${otp}. It expires in 5 minutes.`,
    });
  } catch (err) {
    // Log the real SMTP error on the server but never expose it to the client
    console.error("[SMTP] Failed to send OTP email to", to, ":", err.message);
    const ApiError = require("./ApiError");
    throw ApiError.internal(
      "We couldn't send the verification email. Please try again in a moment."
    );
  }
};

module.exports = { sendEmail, sendOTPEmail };
