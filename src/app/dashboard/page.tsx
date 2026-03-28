"use client";

import Link from "next/link";
import { WORKSTREAMS } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

const WORKSTREAM_ART: Record<string, string> = {
  "city-calendars": "https://images.unsplash.com/photo-1435527173128-983b87201f4d?auto=format&fit=crop&w=1200&q=80",
  financial: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
  quality: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  esports: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
  "300th-anniversary": "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=1200&q=80",
  documents: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&w=1200&q=80",
  "general-support": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
};

export default function DashboardLandingPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#eff5ff_0%,#ffffff_45%,#eef3fa_100%)] p-8 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex rounded-full bg-[#1d4f91]/10 px-3 py-1 text-xs font-semibold text-[#1d4f91]">
            منصة الذكاء الاصطناعي
          </span>
          <h1 className="text-3xl font-bold text-[#15385f] md:text-5xl">
            اختر المسار الذي تريد متابعته
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            بوابة موحّدة للدخول إلى المسارات السبعة. كل بطاقة تنقلك مباشرة إلى مساحة العمل الخاصة بالمسار مع
            نظرة عامة، تحليلات، وموظفي ذكاء اصطناعي متخصصين.
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {WORKSTREAMS.map((workstream) => {
          const Icon = workstream.icon;
          return (
            <Link
              key={workstream.id}
              href={workstream.href}
              className="group relative min-h-[260px] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${WORKSTREAM_ART[workstream.id]})` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,76,146,0.18)_0%,rgba(17,64,119,0.74)_55%,rgba(12,42,82,0.92)_100%)]" />
              <div className="relative flex h-full flex-col justify-between p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                    دخول المسار
                  </span>
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold leading-tight">{workstream.name_ar}</h2>
                  <p className="text-sm leading-7 text-white/82">{workstream.description_ar}</p>
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-white">
                    الانتقال إلى الصفحة
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
