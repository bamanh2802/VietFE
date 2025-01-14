import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chunk, ChunksState } from '../types/types';


const initialState: ChunksState = {};

const chunksSlice = createSlice({
  name: 'chunks',
  initialState,
  reducers: {
    setChunksForDocument: (
      state,
      action: PayloadAction<{ document_id: string; chunks: Chunk[] }>
    ) => {
      const { document_id, chunks } = action.payload;
      state[document_id] = [...(state[document_id] || []), ...chunks];
    },
    resetChunksForDocument: (state, action: PayloadAction<string>) => {
      const document_id = action.payload;
      delete state[document_id]; 
    },
    updateChunk: (state, action: PayloadAction<Chunk>) => {
      const chunk = action.payload;
      const { document_id, chunk_id } = chunk;
      const documentChunks = state[document_id] || [];
      const chunkIndex = documentChunks.findIndex((ch) => ch.chunk_id === chunk_id);
      if (chunkIndex !== -1) {
        documentChunks[chunkIndex] = chunk;
      }
    },
  },
});

export const { setChunksForDocument, resetChunksForDocument, updateChunk } = chunksSlice.actions;

export default chunksSlice.reducer;
