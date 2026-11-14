import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    registerUser as apiRegister,
    loginUser as apiLogin,
    verifyOtp as apiVerifyOtp,
    resendOtp as apiResendOtp,
    logoutUser as apiLogout,
    getCurrentUser as apiGetCurrentUser,
    refreshSession as apiRefreshSession,
} from "@/lib/authApi";
import {
    updateMyProfile as apiUpdateProfile,
    uploadAvatar as apiUploadAvatar,
    requestAccountDeletion as apiRequestAccountDeletion,
    confirmAccountDeletion as apiConfirmAccountDeletion,
} from "@/lib/userApi";

/**
 * store/slices/authSlice.js
 *
 * IMPORTANT: the access token itself is NEVER stored here. It stays in
 * the in-memory singleton inside lib/apiClient.js. Redux only holds the
 * non-sensitive user profile + auth status — this keeps the token out
 * of Redux DevTools / any future persist/serialize config.
 */

const extractErrorMessage = (err, fallback) =>
    err.response?.data?.message || err.message || fallback;

// --- Thunks -----------------------------------------------------------

export const register = createAsyncThunk(
    "auth/register",
    async ({ fullName, email, phone }, { rejectWithValue }) => {
        try {
            const res = await apiRegister({ fullName, email, phone });
            return res.data; // { email }
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Registration failed"));
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async ({ email }, { rejectWithValue }) => {
        try {
            const res = await apiLogin({ email });
            return res.data; // { email }
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Login failed"));
        }
    }
);

/** purpose: "register" | "login" — shared by both flows via the OTP modal. */
export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async ({ email, otp, purpose }, { rejectWithValue }) => {
        try {
            const user = await apiVerifyOtp({ email, otp, purpose });
            return user;
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Verification failed"));
        }
    }
);

export const resendOtp = createAsyncThunk(
    "auth/resendOtp",
    async ({ email, purpose }, { rejectWithValue }) => {
        try {
            await apiResendOtp({ email, purpose });
            return true;
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Couldn't resend code"));
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await apiLogout();
        return true;
    } catch (err) {
        // Even if the network call fails, we still clear local state in the reducer below.
        return rejectWithValue(extractErrorMessage(err, "Logout failed"));
    }
});

/**
 * Called once on app boot (see components/AuthInitializer.js) to silently
 * restore a session using the httpOnly refresh cookie — the access token
 * lives only in memory, so a hard page refresh clears it and this is what
 * re-establishes `isAuthenticated` without asking the user to log in again.
 */
export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const user = await apiRefreshSession();
            return user;
        } catch (err) {
            return rejectWithValue(null); // not logged in — not a real "error" for the UI
        }
    }
);

// --- Profile module thunks -------------------------------------------
// These live in authSlice (not a separate profileSlice) because the
// profile IS the current user — updating it means updating state.auth.user,
// the same single source of truth used across Header/Navbar/protected
// routes. A separate slice would just mean keeping two copies in sync.

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (updates, { rejectWithValue }) => {
        try {
            const user = await apiUpdateProfile(updates);
            return user;
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to update profile"));
        }
    }
);

export const uploadAvatar = createAsyncThunk(
    "auth/uploadAvatar",
    async (file, { rejectWithValue }) => {
        try {
            const user = await apiUploadAvatar(file);
            return user;
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to upload avatar"));
        }
    }
);

export const requestAccountDeletion = createAsyncThunk(
    "auth/requestAccountDeletion",
    async (payload, { rejectWithValue }) => {
        try {
            await apiRequestAccountDeletion(payload);
            return true;
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to send deletion code"));
        }
    }
);

export const confirmAccountDeletion = createAsyncThunk(
    "auth/confirmAccountDeletion",
    async ({ otp, reason }, { rejectWithValue }) => {
        try {
            await apiConfirmAccountDeletion({ otp, reason });
            return true;
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to delete account"));
        }
    }
);

// --- Slice --------------------------------------------------------------

const initialState = {
    user: null,
    isAuthenticated: false,
    initializing: true, // true until the first fetchCurrentUser settles
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // register / login — only send the OTP, no session yet
            .addCase(register.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(register.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(login.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // verifyOtp — this is what actually creates the session
            .addCase(verifyOtp.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // resendOtp — doesn't need to touch user/isAuthenticated
            .addCase(resendOtp.rejected, (state, action) => {
                state.error = action.payload;
            })

            // logout — always clear local state, even if the API call failed
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.status = "idle";
            })
            .addCase(logout.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.status = "idle";
            })

            // fetchCurrentUser — silent session restore on app boot
            .addCase(fetchCurrentUser.pending, (state) => {
                state.initializing = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.initializing = false;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.initializing = false;
            })

            // updateProfile — patches the current user in place
            .addCase(updateProfile.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // uploadAvatar — same pattern, just the avatar field changes
            .addCase(uploadAvatar.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(uploadAvatar.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // requestAccountDeletion — just sends an OTP, no state change beyond error
            .addCase(requestAccountDeletion.rejected, (state, action) => {
                state.error = action.payload;
            })

            // confirmAccountDeletion — account is gone, log the session out locally
            .addCase(confirmAccountDeletion.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.status = "idle";
            })
            .addCase(confirmAccountDeletion.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

// --- Selectors ------------------------------------------------------------
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthInitializing = (state) => state.auth.initializing;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
