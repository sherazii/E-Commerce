import { createSlice } from "@reduxjs/toolkit";

/**
 * 🧠 Initial state of the authentication store
 */
const initialState = {
  auth: null, // will hold user data (token, profile, etc.)
};

/**
 * 🔒 Auth Slice
 * - Handles login/logout actions
 * - Stores authenticated user data in Redux
 */
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * ✅ Login Reducer
     * Stores user authentication data (e.g., JWT, profile)
     */
    login: (state, action) => {
      state.auth = action.payload;
    },

    /**
     * 🚪 Logout Reducer
     * Clears authentication state
     */
    logout: (state) => {
      state.auth = null;
    },
  },
});

/**
 * 🧩 Export Actions
 * - `login()` → sets user data
 * - `logout()` → clears auth data
 */
export const { login, logout } = authSlice.actions;

/**
 * 🧩 Export Reducer
 * Add this to your store configuration
 */
export default authSlice.reducer;
