"use client";

import { useQuery } from "@tanstack/react-query";
import {
  MOCK_INITIATIVES,
  MOCK_FINANCIAL_REPORTS,
  computeDashboardData,
  filterInitiatives,
  type MockInitiative,
  type MockFinancialReport,
} from "./mock-data";

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface DashboardResponse {
  initiatives: {
    total: number;
    by_status: Record<string, number>;
    by_type: Record<string, number>;
    by_event_type_ar: Record<string, number>;
    by_city: Record<string, number>;
    by_tier: Record<string, number>;
    by_month: Record<string, number>;
    total_budget: number;
  };
  top_organizers: { name: string; count: number }[];
  financial: {
    total_allocated: number;
    total_actual_cost: number;
    total_revenue: number;
  };
  budget_summary: {
    total_estimated: number;
    total_allocated: number;
    total_actual_cost: number;
    total_revenue: number;
    variance: number;
  };
  performance: {
    avg_satisfaction: number;
    total_attendance: number;
    total_target: number;
  };
  pending_approvals: number;
  recent_activity: {
    initiative_id: string;
    title: string;
    title_ar: string;
    from_status: string;
    to_status: string;
    at: string;
    by: string;
    via: string | null;
  }[];
}

export function useDashboard(filters?: Record<string, string | number | boolean | undefined>) {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard", filters],
    queryFn: async () => {
      // Apply filters to initiatives first
      const filterParams: any = {};
      if (filters) {
        for (const [k, v] of Object.entries(filters)) {
          if (v !== undefined && v !== null && v !== "" && v !== "all") {
            filterParams[k] = String(v);
          }
        }
      }
      const filtered = filterInitiatives(MOCK_INITIATIVES, filterParams);
      return computeDashboardData(filtered) as DashboardResponse;
    },
    retry: false,
  });
}

export function useInitiatives(params?: Record<string, string | number | boolean | undefined>) {
  return useQuery<PaginatedResponse<MockInitiative>>({
    queryKey: ["initiatives", params],
    queryFn: async () => {
      const filterParams: any = {};
      let page = 1;
      let perPage = 50;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          if (k === "page") { page = Number(v) || 1; continue; }
          if (k === "per_page") { perPage = Number(v) || 50; continue; }
          if (v !== undefined && v !== null && v !== "" && v !== "all") {
            filterParams[k] = String(v);
          }
        }
      }
      const filtered = filterInitiatives(MOCK_INITIATIVES, filterParams);
      const start = (page - 1) * perPage;
      const items = filtered.slice(start, start + perPage);
      return {
        items,
        total: filtered.length,
        page,
        per_page: perPage,
        pages: Math.ceil(filtered.length / perPage),
      };
    },
    retry: false,
  });
}

export function useInitiative(id: string) {
  return useQuery<MockInitiative>({
    queryKey: ["initiative", id],
    queryFn: async () => {
      return MOCK_INITIATIVES.find((i) => i.id === id) || MOCK_INITIATIVES[0];
    },
    retry: false,
  });
}

export function useFinancialReports() {
  return useQuery<PaginatedResponse<MockFinancialReport>>({
    queryKey: ["financial-reports"],
    queryFn: async () => ({
      items: MOCK_FINANCIAL_REPORTS,
      total: MOCK_FINANCIAL_REPORTS.length,
      page: 1,
      per_page: 50,
      pages: 1,
    }),
    retry: false,
  });
}

export function usePerformanceRecords() {
  return useQuery<PaginatedResponse<any>>({
    queryKey: ["performance-records"],
    queryFn: async () => ({
      items: [],
      total: 0,
      page: 1,
      per_page: 50,
      pages: 0,
    }),
    retry: false,
  });
}

export function useApprovals() {
  return useQuery<PaginatedResponse<any>>({
    queryKey: ["approvals"],
    queryFn: async () => ({
      items: [],
      total: 0,
      page: 1,
      per_page: 50,
      pages: 0,
    }),
    retry: false,
  });
}

export function useDecideApproval() {
  return { mutateAsync: async () => {}, isPending: false };
}

// Stub hooks that show the demo message
export function useCreateAIJob() {
  return { mutateAsync: async () => {}, isPending: false };
}

export function useAIJob(_jobId: string | null) {
  return { data: null, isLoading: false, isError: false };
}

export function useAIJobs() {
  return useQuery<PaginatedResponse<any>>({
    queryKey: ["ai-jobs"],
    queryFn: async () => ({
      items: [],
      total: 0,
      page: 1,
      per_page: 50,
      pages: 0,
    }),
    retry: false,
  });
}

export function useGeneratePPT() {
  return { mutateAsync: async () => {}, isPending: false };
}

export function useGenerateCalendarPPT() {
  return { mutateAsync: async () => {}, isPending: false };
}

// Intel Discovery stubs
export interface IntelRunSummary {
  run_id: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  total_scraped: number;
  total_matched: number;
  total_new: number;
  emails_drafted: number;
  sources_used: string[] | null;
  cities_filter: string[] | null;
  triggered_by: string | null;
  error_message: string | null;
}

export interface IntelEventItem {
  event_name: string;
  source: string;
  city: string;
  match_status: string;
  match_score: number;
  classified_tier: string;
  classified_type: string;
}

export function useTriggerIntel() {
  return { mutateAsync: async () => {}, isPending: false };
}

export function useIntelRuns() {
  return useQuery<IntelRunSummary[]>({
    queryKey: ["intel-runs"],
    queryFn: async () => [],
    retry: false,
  });
}

export function useIntelRunStatus(_runId: string | null) {
  return { data: null, isLoading: false };
}

export function useIntelRunDetail(_runId: string | null) {
  return useQuery<{ events: IntelEventItem[] }>({
    queryKey: ["intel-detail", _runId],
    queryFn: async () => ({ events: [] }),
    enabled: false,
    retry: false,
  });
}

export async function downloadIntelCSV(_runId: string) {}
export async function downloadIntelEmail(_runId: string) {}
