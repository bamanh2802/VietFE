import { configureStore } from "@reduxjs/toolkit";

import projectsReducer from "./projectsSlice";
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";
import documentReducer from "./documentSlice";
import conversationReducer from "./conversationSlice";
import outlineReducer from "./outlineSlice"; // Import outlineReducer

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    user: userReducer,
    chat: chatReducer,
    documents: documentReducer,
    conversations: conversationReducer,
    outline: outlineReducer, // Thêm outlineReducer vào store
  },
});

// Lấy kiểu RootState và AppDispatch từ store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
