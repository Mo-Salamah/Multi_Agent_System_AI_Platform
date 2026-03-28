"use client";

import { WORKSTREAMS } from "@/lib/constants";
import { WorkstreamLayout } from "@/components/shared/workstream-layout";
import { WorkstreamOverviewPanel } from "@/components/workstreams/overview-panel";
import { LayoutDashboard, Bot } from "lucide-react";

const ws = WORKSTREAMS.find((w) => w.id === "general-support")!;

export default function GeneralSupportPage() {
  return (
    <WorkstreamLayout
      title_ar={ws.name_ar}
      title_en={ws.name_en}
      subtitle_ar="الدعم العام والتحليلات المتقدمة عبر المسارات"
      subtitle_en="General support and advanced cross-workstream analytics"
      color={ws.color}
      workstreamId="general-support"
      tabs={[
        { id: "overview", label_ar: "نظرة عامة", label_en: "Overview", icon: LayoutDashboard, content: <WorkstreamOverviewPanel workstreamId="general-support" accentColor={ws.color} /> },
        { id: "ai-chat", label_ar: "موظفي الذكاء الاصطناعي", label_en: "AI Staff", icon: Bot, content: null },
      ]}
    />
  );
}
