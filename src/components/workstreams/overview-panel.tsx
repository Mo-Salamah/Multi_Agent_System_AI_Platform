"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WORKSTREAM_OVERVIEWS } from "@/lib/workstream-overviews";
import { Bot, FileStack, Info, MessagesSquare } from "lucide-react";

export function WorkstreamOverviewPanel({
  workstreamId,
  accentColor,
}: {
  workstreamId: keyof typeof WORKSTREAM_OVERVIEWS;
  accentColor: string;
}) {
  const content = WORKSTREAM_OVERVIEWS[workstreamId];

  if (!content) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        لا تتوفر معلومات حول هذا المسار حالياً.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card
        className="overflow-hidden border-0 shadow-none"
        style={{
          background:
            `linear-gradient(135deg, ${accentColor} 0%, color-mix(in srgb, ${accentColor} 74%, #0f172a) 100%)`,
        }}
      >
        <CardContent className="p-8 text-white">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-xs font-medium">
              <Info className="h-3.5 w-3.5" />
              نظرة عامة
            </div>
            {content.description.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-white/88 md:text-[15px]">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="border-slate-200/70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <Bot className="h-4 w-4" style={{ color: accentColor }} />
              الأدوار والموظفون
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content.agents.map((agent) => (
              <div key={agent.name} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{agent.role}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200/70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <FileStack className="h-4 w-4" style={{ color: accentColor }} />
              الملفات المرجعية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content.files.map((file) => (
              <div key={file.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{file.purpose}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200/70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <MessagesSquare className="h-4 w-4" style={{ color: accentColor }} />
              كيف تتفاعل مع المسار
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content.guide.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm leading-6 text-slate-700">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
