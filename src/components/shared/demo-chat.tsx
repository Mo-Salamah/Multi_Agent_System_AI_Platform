"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { MOCK_CONVERSATIONS, type MockConversation } from "@/lib/mock-data";
import { WORKSTREAM_OVERVIEWS } from "@/lib/workstream-overviews";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Send, Bot, User, MessageSquarePlus, Clock, FolderOpen,
  ChevronLeft, ChevronRight, FileText,
} from "lucide-react";

interface DemoChatProps {
  workstreamId: string;
}

export function DemoChat({ workstreamId }: DemoChatProps) {
  const { language: lang } = useAuthStore();
  const [selectedConv, setSelectedConv] = useState<MockConversation | null>(MOCK_CONVERSATIONS[0]);
  const [inputValue, setInputValue] = useState("");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const overview = WORKSTREAM_OVERVIEWS[workstreamId];
  const files = overview?.files || [];

  const handleSend = () => {
    if (!inputValue.trim()) return;
    toast.info("يرجى الربط مع مزود خدمات سيرفرات ذكاء اصطناعي");
    setInputValue("");
  };

  return (
    <div className="flex h-[calc(100vh-220px)] border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Left panel - Conversations */}
      <button
        onClick={() => setLeftPanelOpen(!leftPanelOpen)}
        className="flex items-center justify-center w-6 bg-gray-50 hover:bg-gray-100 border-e border-gray-200 transition-colors"
      >
        {leftPanelOpen ? <ChevronRight className="w-3 h-3 text-gray-400" /> : <ChevronLeft className="w-3 h-3 text-gray-400" />}
      </button>

      {leftPanelOpen && (
        <div className="w-56 border-e border-gray-200 flex flex-col bg-gray-50/50 flex-shrink-0">
          <div className="p-2 border-b border-gray-100">
            <Button
              size="sm"
              className="w-full text-xs gap-1 bg-[#1a365d]"
              onClick={() => toast.info("يرجى الربط مع مزود خدمات سيرفرات ذكاء اصطناعي")}
            >
              <MessageSquarePlus className="w-3 h-3" />
              {lang === "ar" ? "محادثة جديدة" : "New Chat"}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
            {MOCK_CONVERSATIONS.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={cn(
                  "w-full text-start px-2.5 py-2 rounded-md text-xs transition-colors flex items-center gap-2",
                  selectedConv?.id === conv.id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Clock className="w-3 h-3 flex-shrink-0 opacity-50" />
                <span className="truncate">{conv.title_ar}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedConv?.messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                msg.role === "user" ? "bg-blue-100" : "bg-emerald-100"
              )}>
                {msg.role === "user" ? <User className="w-3.5 h-3.5 text-blue-600" /> : <Bot className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <div className={cn(
                "max-w-[70%] rounded-xl px-4 py-2.5 text-sm",
                msg.role === "user" ? "bg-blue-50 text-blue-900" : "bg-gray-50 text-gray-800"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                placeholder={lang === "ar" ? "اكتب رسالتك..." : "Type a message..."}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200 min-h-[42px] max-h-24"
                rows={1}
                dir="rtl"
              />
            </div>
            <Button
              size="icon"
              className="h-[42px] w-[42px] rounded-xl bg-[#1a365d]"
              onClick={handleSend}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right panel - Files */}
      <button
        onClick={() => setRightPanelOpen(!rightPanelOpen)}
        className="flex items-center justify-center w-6 bg-gray-50 hover:bg-gray-100 border-s border-gray-200 transition-colors"
      >
        {rightPanelOpen ? <ChevronLeft className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
      </button>

      {rightPanelOpen && (
        <div className="w-60 border-s border-gray-200 flex flex-col bg-gray-50/50 flex-shrink-0">
          {/* Files section only - no project context */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FolderOpen className="w-3 h-3" />
                {lang === "ar" ? "الملفات" : "Files"}
              </h3>
              <div className="space-y-1.5">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg bg-white border border-gray-100 text-[11px]"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="font-medium text-gray-700 truncate">{file.name}</div>
                      <div className="text-gray-400 truncate">{file.purpose}</div>
                    </div>
                  </div>
                ))}
                {files.length === 0 && (
                  <p className="text-[10px] text-gray-400 text-center py-4">
                    {lang === "ar" ? "لا توجد ملفات" : "No files"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
