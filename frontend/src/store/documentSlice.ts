import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Document } from "../types/types";

interface DocumentsState {
  documents?: Document[];
}

const initialDocumentsState: DocumentsState = {
  documents: undefined,
};

const documentsSlice = createSlice({
  name: "documents",
  initialState: initialDocumentsState,
  reducers: {
    setDocuments: (state, action: PayloadAction<Document[]>) => {
      state.documents = action.payload;
    },
    clearDocuments: (state) => {
      state.documents = undefined;
    },
  },
});

export const { setDocuments, clearDocuments } = documentsSlice.actions;

export default documentsSlice.reducer;
