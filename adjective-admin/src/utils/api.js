// src/utils/api.js

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API_BASE_URL =
    rawApiUrl.endsWith("/api") || rawApiUrl.endsWith("/api/")
        ? rawApiUrl.replace(/\/$/, "")
        : `${rawApiUrl.replace(/\/$/, "")}/api`;

const formatEndpoint = (ep) => {
    if (!ep) return "/";
    let formatted = String(ep);
    if (formatted.startsWith("/api/")) {
        formatted = formatted.slice(4);
    } else if (formatted.startsWith("api/")) {
        formatted = formatted.slice(3);
    }
    if (!formatted.startsWith("/")) {
        formatted = "/" + formatted;
    }
    return formatted;
};

export class ApiError extends Error {
    constructor(message, status = 500, details = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

const buildHeaders = (isFormData = false, customHeaders = {}) => {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

    const headers = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...customHeaders,
    };

    return headers;
};

let refreshTokenPromise = null;

const refreshAccessToken = async () => {
    if (!refreshTokenPromise) {
        refreshTokenPromise = (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) {
                    throw new Error("Refresh failed");
                }

                const json = await res.json();
                const newToken = json?.data?.accessToken;

                if (!newToken) {
                    throw new Error("No access token in response");
                }

                if (typeof window !== "undefined") {
                    localStorage.setItem("token", newToken);
                }

                return newToken;
            } catch (err) {
                if (typeof window !== "undefined") {
                    localStorage.removeItem("token");
                }
                throw err;
            } finally {
                refreshTokenPromise = null;
            }
        })();
    }
    return refreshTokenPromise;
};

const request = async (
    endpoint,
    options = {}
) => {
    const {
        method = "GET",
        body = null,
        headers = {},
        isFormData = false,
        cache = "no-store",
        _isRetry = false,
    } = options;

    const isForm = isFormData || (typeof FormData !== "undefined" && body instanceof FormData);
    const formattedEndpoint = formatEndpoint(endpoint);
    const url = `${API_BASE_URL}${formattedEndpoint}`;
    console.log("Calling:", url);

    const response = await fetch(url, {
        method,
        credentials: "include",
        cache,
        headers: buildHeaders(isForm, headers),
        body: body
            ? isForm
                ? body
                : typeof body === "string"
                    ? body
                    : JSON.stringify(body)
            : undefined,
    });

    const contentType = response.headers.get("content-type") || "";

    let data = null;

    if (contentType.includes("application/json")) {
        data = await response.json();
    }

    if (!response.ok) {
        const isAuthEndpoint =
            formattedEndpoint.includes("/auth/admin-login") ||
            formattedEndpoint.includes("/auth/login") ||
            formattedEndpoint.includes("/auth/register") ||
            formattedEndpoint.includes("/auth/refresh-token");

        if (response.status === 401 && !_isRetry && !isAuthEndpoint) {
            try {
                await refreshAccessToken();
                return await request(endpoint, {
                    ...options,
                    _isRetry: true,
                });
            } catch (refreshErr) {
                if (typeof window !== "undefined") {
                    localStorage.removeItem("token");
                }
                throw new ApiError(
                    data?.message || "Session expired, please login again",
                    401,
                    data
                );
            }
        }

        throw new ApiError(
            data?.message || `Request failed (${response.status})`,
            response.status,
            data
        );
    }

    return data;
};

/* -------------------------------------------------------------------------- */
/*                               Generic Request                              */
/* -------------------------------------------------------------------------- */

export const apiRequest = request;

/* -------------------------------------------------------------------------- */
/*                              REST Helper APIs                              */
/* -------------------------------------------------------------------------- */

export const api = {
    get: (url, options = {}) =>
        request(url, {
            ...options,
            method: "GET",
        }),

    post: (url, body, options = {}) =>
        request(url, {
            ...options,
            method: "POST",
            body,
        }),

    put: (url, body, options = {}) =>
        request(url, {
            ...options,
            method: "PUT",
            body,
        }),

    patch: (url, body, options = {}) =>
        request(url, {
            ...options,
            method: "PATCH",
            body,
        }),

    delete: (url, options = {}) =>
        request(url, {
            ...options,
            method: "DELETE",
        }),
};

export default api;
