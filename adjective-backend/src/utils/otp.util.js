const crypto = require("crypto");
const bcrypt = require("bcrypt");

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const SALT_ROUNDS = 10;

/**
 * Generates a cryptographically random numeric OTP as a string.
 * crypto.randomInt is preferred over Math.random for unpredictability.
 */
const generateOTP = (length = OTP_LENGTH) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return crypto.randomInt(min, max + 1).toString();
};

/** Hashes an OTP before persisting — never store OTPs in plain text. */
const hashOTP = async (otp) => {
  return bcrypt.hash(otp, SALT_ROUNDS);
};

/** Compares a plain OTP against its stored hash. */
const compareOTP = async (plainOTP, hashedOTP) => {
  return bcrypt.compare(plainOTP, hashedOTP);
};

const getOTPExpiry = () => {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
};

module.exports = {
  generateOTP,
  hashOTP,
  compareOTP,
  getOTPExpiry,
  OTP_EXPIRY_MINUTES,
};
