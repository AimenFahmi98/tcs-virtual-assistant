import { configureStore } from "@reduxjs/toolkit";
import documentReducer from "./documentSlice";

export const store = configureStore({
  reducer: {
    documents: documentReducer,
  },
  devTools: process.env.NODE_ENV !== "production", // ✅ Enable DevTools only in development
});
