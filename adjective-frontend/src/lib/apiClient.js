import axios from "axios";

/**
 * Adjective — shared API client
 * Path: lib/apiClient.js
 *
 * Access token lives in memory only (a module-level variable), never
 * localStorage/sessionStorage — that's what makes it safe from XSS
 * token theft. It resets on full page reload by design; getMe() on
 * app boot (see AuthContext) silently re-establishes it using the
 * httpOnly refresh cookie.
 */

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const apiBaseUrl = rawApiUrl.endsWith("/api") || rawApiUrl.endsWith("/api/")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true, // required — sends/receives the httpOnly refresh cookie
});

// Attach the access token to every outgoing request.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// On a 401, try exactly one silent refresh, then retry the original request.
// If refresh also fails, the caller's own catch block handles it (e.g. redirect to sign-in).
let isRefreshing = false;
let pendingQueue = [];

const resolveQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry || originalRequest.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue concurrent requests while a refresh is already in flight.
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post("/auth/refresh-token");
      const newToken = data.data.accessToken;
      setAccessToken(newToken);
      resolveQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      resolveQueue(refreshError, null);
      clearAccessToken();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
