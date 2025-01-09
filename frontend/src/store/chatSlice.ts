import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { ChatState, Chunk } from "../types/types";

const initialState: ChatState = {
  conversations: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage: (
      state,
      action: PayloadAction<{ conversation_id: string; content: string }>,
    ) => {
      const { conversation_id, content } = action.payload;

      if (!state.conversations[conversation_id]) {
        state.conversations[conversation_id] = {
          messages: [],
          isLoading: false,
        };
      }
      state.conversations[conversation_id].messages.push({
        id: uuidv4(),
        sender: "User",
        content,
        status: "sent",
        chunk_ids: [],
      });
    },
    addServerMessage: (
      state,
      action: PayloadAction<{ conversation_id: string; content: string }>,
    ) => {
      const { conversation_id, content } = action.payload;

      if (!state.conversations[conversation_id]) {
        state.conversations[conversation_id] = {
          messages: [],
          isLoading: false,
        };
      }
      state.conversations[conversation_id].messages.push({
        id: uuidv4(),
        sender: "Server",
        content,
        status: "streaming",
        chunk_ids: [],
      });
      state.conversations[conversation_id].isLoading = true;
    },
    updateServerMessage: (
      state,
      action: PayloadAction<{ conversation_id: string; content: string }>,
    ) => {
      const { conversation_id, content } = action.payload;
      const conversation = state.conversations[conversation_id];

      if (conversation) {
        const lastMessage =
          conversation.messages[conversation.messages.length - 1];

        if (
          lastMessage &&
          lastMessage.sender === "Server" &&
          lastMessage.status === "streaming"
        ) {
          lastMessage.content += content;
        }
      }
    },
    finalizeServerMessage: (
      state,
      action: PayloadAction<{ conversation_id: string; chunk_ids: Chunk[] }>
    ) => {
      const { conversation_id, chunk_ids } = action.payload;
      const conversation = state.conversations[conversation_id];
    
      if (conversation) {
        const lastMessage =
          conversation.messages[conversation.messages.length - 1];
    
        if (
          lastMessage &&
          lastMessage.sender === "Server" &&
          lastMessage.status === "streaming"
        ) {
          lastMessage.status = "sent";
    
          // Đảm bảo chunk_ids luôn là mảng
          if (!lastMessage.chunk_ids) {
            lastMessage.chunk_ids = [];
          }
          if (chunk_ids) {
            lastMessage.chunk_ids = [...lastMessage.chunk_ids, ...chunk_ids];
          }
        }
        conversation.isLoading = false;
      }
    },
    addChatHistory: (
      state,
      action: PayloadAction<{ conversation_id: string; messages: any[] }>
    ) => {
      const { conversation_id, messages } = action.payload;

      if (!state.conversations[conversation_id]) {
        state.conversations[conversation_id] = {
          messages: [],
          isLoading: false,
        };
      }

      const conversation = state.conversations[conversation_id];

      messages.forEach((msg) => {
        const { message_id, content, created_at, chunk_ids = [], document_ids = [] } = msg;
        const sender = message_id.startsWith("umsg-") ? "User" : "Server";

        conversation.messages.push({
          id: message_id,
          sender,
          content,
          status: "sent", 
          chunk_ids,
        });
      });
    }
  },
});

export const {
  addUserMessage,
  addServerMessage,
  updateServerMessage,
  finalizeServerMessage,
  addChatHistory,
} = chatSlice.actions;

export default chatSlice.reducer;
