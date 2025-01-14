import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Document } from "../types/types";

interface DocumentState {
  document?: Document;
}

const initialDocumentState: DocumentState = {
  document: undefined,
};

const documentViewSlice = createSlice({
  name: "document",
  initialState: initialDocumentState,
  reducers: {
    setDocument: (state, action: PayloadAction<Document>) => {
      state.document = action.payload;
    },
    clearDocument: (state) => {
      state.document = undefined;
    },
  },
});

export const { setDocument, clearDocument } = documentViewSlice.actions;

export default documentViewSlice.reducer;
