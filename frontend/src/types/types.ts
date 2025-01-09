export interface Project {
  project_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  doc_count: number;
  conv_count: number;
}

export interface Document {
  created_at: string;
  document_id: string;
  document_name: string;
  document_path: string;
  project_id: string;
  type: string;
  updated_at: string;
}

export interface ImageType {
  image_id: string;
  image_path: string;
  document_id: string;
  page: number;
  order_in_ref: number;
  caption: string;
}

export interface Conversation {
  conversation_id: string;
  conversation_name: string;
  created_at: string;
  updated_at: string;
  project_id: string;
}
export interface User {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  dob: string;
}

export interface Message {
  id: string;
  sender: "User" | "Server";
  content: string;
  status: "sent" | "streaming";
  chunk_ids?: Chunk[]; // Thêm thuộc tính này
}

export interface ConversationState {
  messages: Message[];
  isLoading: boolean;
}

export interface ChatState {
  conversations: {
    [conversation_id: string]: ConversationState;
  };
}

export interface Chunk {
  chunk_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  document_id: string;
  order_in_ref: number;
}

export interface Note {
  note_id: string;
  title: string;
  content: string;
  formatted_text: string;
  created_at: string;
  updated_at: string;
  project_id: string;
}

export interface MessageHistory {
  message_id: string,
  content: string,
  create_at: string,
  conversation_id: string
}

export interface NoteSearch {
  note_content: string,
  note_id: string,
  note_title: string
}

export interface DocumentSearch {
  content: string,
  document_id: string,
  document_name: string
}