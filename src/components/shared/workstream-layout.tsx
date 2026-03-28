"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { DemoChat } from "./demo-chat";
import { Bot, Clock, type LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label_ar: string;
  label_en: string;
  icon: LucideIcon;
  content: ReactNode;
}

interface WorkstreamLayoutProps {
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  color: string;
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  chatWelcome_ar?: string;
  chatWelcome_en?: string;
  chatSuggestions_ar?: string[];
  chatSuggestions_en?: string[];
  workstreamId: string;
}

export function WorkstreamLayout({
  title_ar,
  title_en,
  subtitle_ar,
  subtitle_en,
  color,
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  workstreamId,
}: WorkstreamLayoutProps) {
  const { language: lang } = useAuthStore();
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id || "ai-chat");
  const activeTab = controlledActiveTab ?? internalActiveTab;
  const setActiveTab = (tab: string) => {
    if (onTabChange) onTabChange(tab);
    else setInternalActiveTab(tab);
  };

  const activeTabContent = tabs.find((t) => t.id === activeTab);
  const isChat = activeTab === "ai-chat";

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold" style={{ color }}>
          {lang === "ar" ? title_ar : title_en}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {lang === "ar" ? subtitle_ar : subtitle_en}
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 transition-colors",
                isActive
                  ? "border-[#1a365d] text-[#1a365d] font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon className="w-4 h-4" />
              {lang === "ar" ? tab.label_ar : tab.label_en}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isChat ? (
        <DemoChat workstreamId={workstreamId} />
      ) : (
        activeTabContent?.content
      )}
    </div>
  );
}
