import { configureStore } from "@reduxjs/toolkit";
import documentReducer from "./documentSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    documents: documentReducer,
    users: userReducer,
  },
  devTools: process.env.NODE_ENV !== "production", // ✅ Enable DevTools only in development
});
