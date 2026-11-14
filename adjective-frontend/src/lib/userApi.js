import api from "./apiClient";

/**
 * Path: lib/userApi.js
 *
 * Profile module ("Account Management") — deliberately separate from
 * authApi.js ("Authentication"). Auth answers "who are you / are you
 * logged in"; this answers "manage your account". Keeping them apart
 * means the Profile module can grow (preferences, activity, deletion)
 * without auth.js ever needing to change.
 */

/** GET /api/users/me — full profile (used by the Profile page itself). */
export const getMyProfile = async () => {
  const { data } = await api.get("/users/me");
  return data.data.user;
};

/**
 * PUT /api/users/me — partial update, send only changed fields.
 * Accepts: fullName, phone, bio, address{}, preferences{}
 */
export const updateMyProfile = async (updates) => {
  const { data } = await api.put("/users/me", updates);
  return data.data.user;
};

/** POST /api/users/upload-avatar — multipart/form-data, field name "avatar". */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.post("/users/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data.user;
};

/** GET /api/users/activity — saved properties / inquiries / appointments summary. */
export const getMyActivity = async () => {
  const { data } = await api.get("/users/activity");
  return data.data.activity;
};

/** POST /api/users/me/request-deletion — step 1, sends an OTP. */
export const requestAccountDeletion = async ({ reason } = {}) => {
  const { data } = await api.post("/users/me/request-deletion", { reason });
  return data;
};

/** DELETE /api/users/me — step 2, confirms with OTP and soft-deletes. */
export const confirmAccountDeletion = async ({ otp, reason }) => {
  const { data } = await api.delete("/users/me", { data: { otp, reason } });
  return data;
};

/** POST /api/users/apply-agent */
export const applyForAgent = async ({ agencyName, licenseNumber, bio }) => {
  const { data } = await api.post("/users/apply-agent", { agencyName, licenseNumber, bio });
  return data.data.user;
};
