import { configureStore } from "@reduxjs/toolkit";

import adminReducer from "./adminSlice";
import userReducer from "./userSlice";
import uiReducer from "./uiSlice";
import chatSlice from "./chatSlice";
import documentReducer from "./documentSlice";
import agentSlice from "./agentSlice";
import roleSlice from "./roleSlice";
import notificationSlice from "./notificationSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    users: userReducer,
    ui: uiReducer,
    chat: chatSlice,
    documents: documentReducer,
    agent: agentSlice,
    roles: roleSlice,
    notifications: notificationSlice,
  },

  devTools: process.env.NODE_ENV !== "production", // ✅ Enable DevTools only in development
});
