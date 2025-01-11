// outlineSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OutlineState {
  content: string;
}

const initialState: OutlineState = {
  content: '',
};

const outlineSlice = createSlice({
  name: 'outline',
  initialState,
  reducers: {
    setOutlineContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    clearOutlineContent: (state) => {
      state.content = '';
    },
  },
});

export const { setOutlineContent, clearOutlineContent } = outlineSlice.actions;

export default outlineSlice.reducer;
