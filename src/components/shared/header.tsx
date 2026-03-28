"use client";

import { useAuthStore } from "@/stores/auth-store";
import { l } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Menu, Bell } from "lucide-react";
import { toast } from "sonner";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, language: lang } = useAuthStore();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h2 className="text-sm font-semibold text-[#1a365d] hidden sm:block">
          {l("platformTitle", lang)}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => toast.info("يرجى الربط مع مزود خدمات سيرفرات ذكاء اصطناعي")}
          >
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 transition-colors outline-none">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="bg-[#1a365d] text-white text-xs">
                {user?.full_name_ar?.charAt(0) || "م"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-700 hidden sm:block">
              {lang === "ar" ? (user?.full_name_ar || "مستخدم تجريبي") : (user?.full_name || "Demo User")}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem className="gap-2">
              <User className="w-4 h-4" />
              {l("profile", lang)}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-red-600"
              onClick={() => toast.info("يرجى الربط مع مزود خدمات سيرفرات ذكاء اصطناعي")}
            >
              <LogOut className="w-4 h-4" />
              {l("logout", lang)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
