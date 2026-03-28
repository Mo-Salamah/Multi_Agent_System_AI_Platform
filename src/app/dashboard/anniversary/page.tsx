"use client";

import { WORKSTREAMS } from "@/lib/constants";
import { WorkstreamLayout } from "@/components/shared/workstream-layout";
import { WorkstreamOverviewPanel } from "@/components/workstreams/overview-panel";
import { LayoutDashboard, Bot } from "lucide-react";

const ws = WORKSTREAMS.find((w) => w.id === "300th-anniversary")!;

export default function AnniversaryPage() {
  return (
    <WorkstreamLayout
      title_ar={ws.name_ar}
      title_en={ws.name_en}
      subtitle_ar="متابعة برنامج احتفالية مرور 300 عام على تأسيس الدولة السعودية"
      subtitle_en="Track the 300th Saudi Founding Anniversary national program"
      color={ws.color}
      workstreamId="300th-anniversary"
      tabs={[
        { id: "overview", label_ar: "نظرة عامة", label_en: "Overview", icon: LayoutDashboard, content: <WorkstreamOverviewPanel workstreamId="300th-anniversary" accentColor={ws.color} /> },
        { id: "ai-chat", label_ar: "موظفي الذكاء الاصطناعي", label_en: "AI Staff", icon: Bot, content: null },
      ]}
    />
  );
}
