import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // ✅ correct import
import authReducer from "./reducer/authSlice";
import cartReducer from "./reducer/cartSlice";

/**
 * 🧩 Combine all reducers
 */
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

/**
 * ⚙️ Redux Persist Configuration
 */
const persistConfig = {
  key: "root", // key for localStorage
  storage, // ✅ correct
};

/**
 * 💾 Create a persisted reducer
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * 🏗️ Configure the Redux store
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ required for redux-persist
    }),
});

/**
 * ♻️ Persistor instance for <PersistGate>
 */
export const persistor = persistStore(store);
