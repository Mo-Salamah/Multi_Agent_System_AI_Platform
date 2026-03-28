"use client";

import { useState } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";
import { AuthGuard } from "@/components/shared/auth-guard";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="right" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
