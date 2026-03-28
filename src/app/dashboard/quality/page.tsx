"use client";

import { WORKSTREAMS } from "@/lib/constants";
import { WorkstreamLayout } from "@/components/shared/workstream-layout";
import { WorkstreamOverviewPanel } from "@/components/workstreams/overview-panel";
import { LayoutDashboard, Bot } from "lucide-react";

const ws = WORKSTREAMS.find((w) => w.id === "quality")!;

export default function QualityPage() {
  return (
    <WorkstreamLayout
      title_ar={ws.name_ar}
      title_en={ws.name_en}
      subtitle_ar="متابعة مؤشرات الأداء والجودة عبر المسارات والفعاليات"
      subtitle_en="Track performance and quality KPIs across workstreams and events"
      color={ws.color}
      workstreamId="quality"
      tabs={[
        { id: "overview", label_ar: "نظرة عامة", label_en: "Overview", icon: LayoutDashboard, content: <WorkstreamOverviewPanel workstreamId="quality" accentColor={ws.color} /> },
        { id: "ai-chat", label_ar: "موظفي الذكاء الاصطناعي", label_en: "AI Staff", icon: Bot, content: null },
      ]}
    />
  );
}
