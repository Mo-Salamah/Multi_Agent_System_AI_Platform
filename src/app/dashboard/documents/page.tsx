"use client";

import { WORKSTREAMS } from "@/lib/constants";
import { WorkstreamLayout } from "@/components/shared/workstream-layout";
import { WorkstreamOverviewPanel } from "@/components/workstreams/overview-panel";
import { LayoutDashboard, Bot } from "lucide-react";

const ws = WORKSTREAMS.find((w) => w.id === "documents")!;

export default function DocumentsPage() {
  return (
    <WorkstreamLayout
      title_ar={ws.name_ar}
      title_en={ws.name_en}
      subtitle_ar="إدارة الوثائق والتعاميم والتوجيهات الرسمية"
      subtitle_en="Manage official documents, circulars, and directives"
      color={ws.color}
      workstreamId="documents"
      tabs={[
        { id: "overview", label_ar: "نظرة عامة", label_en: "Overview", icon: LayoutDashboard, content: <WorkstreamOverviewPanel workstreamId="documents" accentColor={ws.color} /> },
        { id: "ai-chat", label_ar: "موظفي الذكاء الاصطناعي", label_en: "AI Staff", icon: Bot, content: null },
      ]}
    />
  );
}
