import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation } from "../types/types";

interface ConversationsState {
  conversations?: Conversation[];
}

const initialConversationsState: ConversationsState = {
  conversations: undefined,
};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState: initialConversationsState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    clearConversations: (state) => {
      state.conversations = undefined;
    },
  },
});

export const { setConversations, clearConversations } = conversationsSlice.actions;

export default conversationsSlice.reducer;
