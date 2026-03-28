import { create } from "zustand";

interface User {
  id: string;
  email: string;
  full_name: string;
  full_name_ar: string;
  role: string;
  entity_id: string;
  entity_name?: string;
  entity_name_ar?: string;
  language_preference?: string;
  is_active: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  language: "ar" | "en";
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLanguage: (lang: "ar" | "en") => void;
  setUser: (user: User) => void;
}

const DEMO_USER: User = {
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
};

export const useAuthStore = create<AuthState>((set) => ({
  user: DEMO_USER,
  token: "demo-token-static",
  isAuthenticated: true,
  language: "ar",

  setAuth: (user, token) => {
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    set({ user: DEMO_USER, token: "demo-token-static", isAuthenticated: true });
  },

  setLanguage: (language) => {
    set({ language });
    if (typeof document !== "undefined") {
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  },

  setUser: (user) => set({ user }),
}));
