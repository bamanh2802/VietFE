// src/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isDocumentViewerOpen: boolean;
}

const initialState: UIState = {
  isDocumentViewerOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openDocumentViewer: (state) => {
      state.isDocumentViewerOpen = true;
    },
    closeDocumentViewer: (state) => {
      state.isDocumentViewerOpen = false;
    },
  },
});

export const { openDocumentViewer, closeDocumentViewer } = uiSlice.actions;

export default uiSlice.reducer;
