import { MOCK_CONVERSATIONS, type MockConversation } from "./mock-data";

export interface ChatSource {
  title: string;
  content: string;
  collection?: string;
  score?: number;
}

export interface ChatFileAttachment {
  filename: string;
  content_type: string;
  size: number;
}

export interface Conversation {
  id: string;
  workstream_id: string;
  user_id: string;
  title: string;
  title_ar: string;
  created_at: string;
}

export async function sendMessage() {
  return { content: "يرجى الربط مع مزود خدمات سيرفرات ذكاء اصطناعي" };
}

export async function sendMessageStream() {
  return { content: "يرجى الربط مع مزود خدمات سيرفرات ذكاء اصطناعي" };
}

export async function uploadChatFile() {
  return { filename: "", size: 0 };
}

export async function listConversations(_wsId: string): Promise<Conversation[]> {
  return MOCK_CONVERSATIONS.map((c) => ({
    id: c.id,
    workstream_id: _wsId,
    user_id: "demo-user-001",
    title: c.title,
    title_ar: c.title_ar,
    created_at: c.created_at,
  }));
}

export async function getConversation(conversationId: string): Promise<MockConversation | null> {
  return MOCK_CONVERSATIONS.find((c) => c.id === conversationId) || null;
}

export async function createConversation(_wsId: string): Promise<Conversation> {
  return {
    id: "new-conv",
    workstream_id: _wsId,
    user_id: "demo-user-001",
    title: "New Conversation",
    title_ar: "محادثة جديدة",
    created_at: new Date().toISOString(),
  };
}

export async function deleteConversation(_id: string) {}
