"use client";

import { WORKSTREAMS } from "@/lib/constants";
import { WorkstreamLayout } from "@/components/shared/workstream-layout";
import { WorkstreamOverviewPanel } from "@/components/workstreams/overview-panel";
import { LayoutDashboard, Bot } from "lucide-react";

const ws = WORKSTREAMS.find((w) => w.id === "esports")!;

export default function EsportsPage() {
  return (
    <WorkstreamLayout
      title_ar={ws.name_ar}
      title_en={ws.name_en}
      subtitle_ar="متابعة بطولات الرياضات الإلكترونية والشراكات الدولية"
      subtitle_en="Track eSports tournaments and international partnerships"
      color={ws.color}
      workstreamId="esports"
      tabs={[
        { id: "overview", label_ar: "نظرة عامة", label_en: "Overview", icon: LayoutDashboard, content: <WorkstreamOverviewPanel workstreamId="esports" accentColor={ws.color} /> },
        { id: "ai-chat", label_ar: "موظفي الذكاء الاصطناعي", label_en: "AI Staff", icon: Bot, content: null },
      ]}
    />
  );
}
