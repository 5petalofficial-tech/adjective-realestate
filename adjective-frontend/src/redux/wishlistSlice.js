"use client";

import { createSlice } from "@reduxjs/toolkit";

// Helper function to safely read from localStorage in browser environment
const loadWishlistFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("adjective_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load wishlist from localStorage", e);
      return [];
    }
  }
  return [];
};

// Helper function to save to localStorage
const saveWishlistToStorage = (items) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("adjective_wishlist", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: loadWishlistFromStorage(),
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const property = action.payload;
      const index = state.items.findIndex((item) => item.id === property.id);

      if (index >= 0) {
        // Already in wishlist -> remove it
        state.items.splice(index, 1);
      } else {
        // Not in wishlist -> add it
        state.items.push(property);
      }
      saveWishlistToStorage(state.items);
    },
    removeFromWishlist: (state, action) => {
      const propertyId = action.payload;
      state.items = state.items.filter((item) => item.id !== propertyId);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage([]);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;