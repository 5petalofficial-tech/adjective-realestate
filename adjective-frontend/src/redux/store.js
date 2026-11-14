import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./wishlistSlice"
import authReducer from "./authSlice"

export const store = configureStore({
    reducer: {
        wishlist: wishlistReducer,
        auth: authReducer,
    },
});