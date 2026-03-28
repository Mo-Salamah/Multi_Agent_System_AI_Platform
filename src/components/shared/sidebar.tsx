"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { WORKSTREAMS } from "@/lib/constants";
import { LayoutDashboard } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { language: lang } = useAuthStore();

  const navItems = [
    {
      label_ar: "لوحة المعلومات",
      label_en: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    ...WORKSTREAMS.map((ws) => ({
      label_ar: ws.name_ar,
      label_en: ws.name_en,
      href: ws.href,
      icon: ws.icon,
      color: ws.color,
    })),
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-e border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="min-w-0">
            <div className="text-sm font-bold text-[#1a365d] truncate">
              {lang === "ar" ? "منصة الذكاء الاصطناعي" : "AI Platform"}
            </div>
            <div className="text-[10px] text-gray-400">
              {lang === "ar" ? "نسخة تجريبية" : "Demo Version"}
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-[#1a365d] text-white font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                className="w-4.5 h-4.5 flex-shrink-0"
                style={!isActive && (item as any).color ? { color: (item as any).color } : undefined}
              />
              <span className="truncate">{lang === "ar" ? item.label_ar : item.label_en}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <div className="text-[10px] text-gray-400 text-center">
          {lang === "ar" ? "الإصدار 1.0 — نسخة تجريبية" : "v1.0 — Demo"}
        </div>
      </div>
    </aside>
  );
}
