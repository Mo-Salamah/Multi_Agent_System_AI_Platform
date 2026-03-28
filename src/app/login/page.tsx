"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleDemoLogin = () => {
    setAuth(
      {
        id: "demo-user-001",
        email: "demo@platform.sa",
        full_name: "Demo User",
        full_name_ar: "مستخدم تجريبي",
        role: "super_admin",
        entity_id: "demo-entity-001",
        entity_name: "المنصة",
        entity_name_ar: "المنصة",
        language_preference: "ar",
        is_active: true,
        created_at: "2026-01-01T00:00:00Z",
      },
      "demo-token-static"
    );
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0c2a52] to-[#1a365d]">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#1a365d]">منصة الذكاء الاصطناعي</h1>
            <p className="text-sm text-gray-500">نسخة تجريبية للعرض</p>
          </div>
          <Button
            className="w-full bg-[#1a365d] hover:bg-[#15385f] text-white py-6 text-lg"
            onClick={handleDemoLogin}
          >
            دخول النسخة التجريبية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
