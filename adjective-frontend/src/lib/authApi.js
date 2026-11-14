import api, { setAccessToken, clearAccessToken } from "./apiClient";

/**
 * Path: lib/authApi.js
 * One function per backend endpoint — keeps page components free of
 * raw axios calls and URL strings.
 */

export const registerUser = async ({ fullName, email, phone }) => {
  const { data } = await api.post("/auth/register", { fullName, email, phone });
  return data; // { success, message, data: { email } }
};

export const loginUser = async ({ email }) => {
  const { data } = await api.post("/auth/login", { email });
  return data;
};

export const resendOtp = async ({ email, purpose }) => {
  const { data } = await api.post("/auth/resend-otp", { email, purpose });
  return data;
};

/**
 * purpose: "register" | "login"
 * On success, stores the access token in memory and returns the user.
 */
export const verifyOtp = async ({ email, otp, purpose }) => {
  const { data } = await api.post("/auth/verify-otp", { email, otp, purpose });
  setAccessToken(data.data.accessToken);
  return data.data.user;
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data.data.user;
};

export const refreshSession = async () => {
  const { data } = await api.post("/auth/refresh-token");
  setAccessToken(data.data.accessToken);
  return data.data.user;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
  clearAccessToken();
};
