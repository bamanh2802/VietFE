// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './projectsSlice';
import userReducer from './userSlice';
import chatReducer from './chatSlice';
import documentReducer from './documentSlice';
import conversationReducer from './conversationSlice';
import outlineReducer from './outlineSlice';
import chunksReducer from './chunkSlice';
import uiReducer from './uiSlice';
import documentViewSlice from './documentViewSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    chunks: chunksReducer,
    projects: projectsReducer,
    user: userReducer,
    chat: chatReducer,
    documents: documentReducer,
    conversations: conversationReducer,
    outline: outlineReducer,
    documentView: documentViewSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
