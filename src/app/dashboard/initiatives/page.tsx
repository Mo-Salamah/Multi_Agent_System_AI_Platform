"use client";

import React, { useState, useMemo } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Initiative = any;
import {
  useInitiatives, useDashboard,
} from "@/lib/api-hooks";
import { useAuthStore } from "@/stores/auth-store";
import { l } from "@/lib/labels";
import {
  CITIES, INITIATIVE_TYPES, WORKSTREAMS,
  EVENT_TIERS, EVENT_TYPES_AR, ADDITION_STATUSES, FUNDING_STATUSES, INCLUSION_STATUSES,
} from "@/lib/constants";
import { SkeletonTable, SkeletonPage } from "@/components/shared/skeleton-card";
import { WorkstreamLayout } from "@/components/shared/workstream-layout";
import { WorkstreamOverviewPanel } from "@/components/workstreams/overview-panel";
import { cn, formatBudget, formatDate, formatNumberLocale, formatNumber, t } from "@/lib/utils";
import {
  getFundingColor,
  getInclusionColor,
  getTierColor,
  getTierColorNeutral,
  getTypeColor,
} from "@/lib/event-theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { toast } from "sonner";
import {
  Search, X, List, CalendarDays, LayoutDashboard,
  BarChart3, ChevronDown, Check, Bot,
} from "lucide-react";

const ws = WORKSTREAMS.find((w) => w.id === "city-calendars")!;

const YEAR_OPTIONS = [2024, 2025, 2026, 2027];
const FILTER_TRIGGER_CLASS = "w-[156px]";
const MONTH_NAMES_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const MONTH_NAMES_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getAdditionalField(initiative: Initiative, ...keys: string[]) {
  const raw = initiative as unknown as Record<string, unknown>;
  const additional = (initiative.additional_data || {}) as Record<string, unknown>;

  for (const key of keys) {
    const direct = raw[key];
    if (direct !== undefined && direct !== null && direct !== "") return String(direct);
    const nested = additional[key];
    if (nested !== undefined && nested !== null && nested !== "") return String(nested);
  }

  return "";
}

function getEventOwner(initiative: Initiative) {
  return getAdditionalField(initiative, "organizer", "organizer_ar", "الجهة المسؤولة") || "—";
}

function getEventTypeLabel(initiative: Initiative, lang: string) {
  const eventTypeAr = getAdditionalField(initiative, "event_type_ar", "النوع");
  if (eventTypeAr) return eventTypeAr;
  return lang === "ar"
    ? INITIATIVE_TYPES.find((tp) => tp.value === initiative.initiative_type)?.label_ar || "—"
    : INITIATIVE_TYPES.find((tp) => tp.value === initiative.initiative_type)?.label_en || "—";
}

function getEventTier(initiative: Initiative) {
  return getAdditionalField(initiative, "tier", "التصنيف") || "—";
}

function getEventVenue(initiative: Initiative, lang: string) {
  return getAdditionalField(
    initiative,
    "venue_ar",
    "venue",
    "event_location",
    "مكان إقامة الفعالية",
    lang === "ar" ? "venue_ar" : "venue"
  ) || (lang === "ar" ? initiative.venue_ar : initiative.venue) || "—";
}

function getEventDays(initiative: Initiative) {
  return getAdditionalField(initiative, "duration_days", "عدد الأيام") || "—";
}

function getContinuityStatus(initiative: Initiative) {
  return getAdditionalField(initiative, "continuity", "التواصل") || "—";
}

function getInclusionStatus(initiative: Initiative) {
  return getAdditionalField(initiative, "inclusion_status", "حالة التضمين") || "—";
}

function getAdditionStatus(initiative: Initiative) {
  return getAdditionalField(initiative, "addition_status", "حالة الإضافة") || "—";
}

function getFundingStatus(initiative: Initiative) {
  return getAdditionalField(initiative, "funding_status", "التمويل") || "—";
}

function getSubcategory(initiative: Initiative) {
  return getAdditionalField(initiative, "subcategory", "الفئة الفرعية") || "—";
}

function getExclusionReason(initiative: Initiative) {
  return getAdditionalField(initiative, "exclusion_reason", "سبب الاستبعاد") || "—";
}

function getEventLink(initiative: Initiative) {
  return getAdditionalField(initiative, "event_link", "رابط الفعالية");
}

function getBudgetValue(initiative: Initiative) {
  return getAdditionalField(initiative, "budget", "الميزانية") || (initiative.estimated_budget ? String(initiative.estimated_budget) : "");
}

// ─── Multi-select dropdown ─────────────────────────────────────────────

interface MultiSelectOption { value: string; label: string }

function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder,
  className,
}: {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (vals: string[]) => void;
  placeholder: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  const displayText =
    selected.length === 0
      ? placeholder
      : selected.length === 1
      ? selected[0]
      : `${selected.length} محدد`;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <span className="truncate flex-1 text-start">{displayText}</span>
        <ChevronDown className="h-4 w-4 opacity-50 ms-2 flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute z-[100] mt-1 w-full min-w-[180px] rounded-md border bg-popover shadow-lg">
          <div className="max-h-72 overflow-y-auto p-1">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className="flex items-center gap-2 rounded px-2 py-1.5 text-sm cursor-pointer hover:bg-accent select-none"
              >
                <div className={cn(
                  "h-4 w-4 rounded border flex items-center justify-center flex-shrink-0",
                  selected.includes(opt.value) ? "bg-primary border-primary" : "border-input"
                )}>
                  {selected.includes(opt.value) && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared filter bar for all 7 CSV-column filters ─────────────────

interface FilterBarProps {
  organizer: string;
  setOrganizer: (v: string) => void;
  tiers: string[];
  setTiers: (v: string[]) => void;
  eventTypesAr: string[];
  setEventTypesAr: (v: string[]) => void;
  cities: string[];
  setCities: (v: string[]) => void;
  additionStatus: string;
  setAdditionStatus: (v: string) => void;
  fundingStatus: string;
  setFundingStatus: (v: string) => void;
  inclusionStatus: string;
  setInclusionStatus: (v: string) => void;
  organizerOptions: { value: string; label: string }[];
  lang: string;
  onClear: () => void;
}

function FilterBar({
  organizer, setOrganizer,
  tiers, setTiers,
  eventTypesAr, setEventTypesAr,
  cities, setCities,
  additionStatus, setAdditionStatus,
  fundingStatus, setFundingStatus,
  inclusionStatus, setInclusionStatus,
  organizerOptions,
  lang,
  onClear,
}: FilterBarProps) {
  const hasFilters =
    organizer !== "" || tiers.length > 0 || eventTypesAr.length > 0 ||
    cities.length > 0 || additionStatus !== "" || fundingStatus !== "" ||
    inclusionStatus !== "";

  const cityOptions: MultiSelectOption[] = CITIES.map((c) => ({
    value: c.name_ar,
    label: lang === "ar" ? c.name_ar : c.name_en,
  }));
  const typeOptions: MultiSelectOption[] = EVENT_TYPES_AR.map((t) => ({ value: t.value, label: t.label }));
  const tierOptions: MultiSelectOption[] = EVENT_TIERS.map((t) => ({ value: t.value, label: t.label }));

  return (
    <Card className="border-gray-100 overflow-visible">
      <CardContent className="p-4 overflow-visible">
        <div className="flex flex-wrap gap-3">
          {/* 1. City — multi-select */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-gray-500">{lang === "ar" ? "المدينة:" : "City:"}</span>
            <MultiSelectDropdown
              options={cityOptions}
              selected={cities}
              onChange={setCities}
              placeholder={lang === "ar" ? "جميع المدن" : "All Cities"}
              className={FILTER_TRIGGER_CLASS}
            />
          </div>

          {/* 2. Type — multi-select */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-gray-500">{lang === "ar" ? "النوع:" : "Type:"}</span>
            <MultiSelectDropdown
              options={typeOptions}
              selected={eventTypesAr}
              onChange={setEventTypesAr}
              placeholder={lang === "ar" ? "جميع الأنواع" : "All Types"}
              className={FILTER_TRIGGER_CLASS}
            />
          </div>

          {/* 3. Tier — multi-select */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-gray-500">{lang === "ar" ? "التصنيف:" : "Tier:"}</span>
            <MultiSelectDropdown
              options={tierOptions}
              selected={tiers}
              onChange={setTiers}
              placeholder={lang === "ar" ? "جميع التصنيفات" : "All Tiers"}
              className={FILTER_TRIGGER_CLASS}
            />
          </div>

          {/* 4. Organizer */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-gray-500">{lang === "ar" ? "الجهة المسؤولة:" : "Organizer:"}</span>
            <Select value={organizer} onValueChange={(v) => setOrganizer(v ?? "all")}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder={lang === "ar" ? "جميع الجهات" : "All Organizers"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === "ar" ? "جميع الجهات" : "All Organizers"}</SelectItem>
                {organizerOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 5. Inclusion */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-gray-500">{lang === "ar" ? "حالة التضمين:" : "Inclusion:"}</span>
            <Select value={inclusionStatus} onValueChange={(v) => setInclusionStatus(v ?? "all")}>
              <SelectTrigger className={FILTER_TRIGGER_CLASS}>
                <SelectValue placeholder={lang === "ar" ? "جميع حالات التضمين" : "All"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === "ar" ? "جميع حالات التضمين" : "All"} </SelectItem>
                {INCLUSION_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 6. Addition Status */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-gray-500">{lang === "ar" ? "حالة الإضافة:" : "Addition:"}</span>
            <Select value={additionStatus} onValueChange={(v) => setAdditionStatus(v ?? "all")}>
              <SelectTrigger className={FILTER_TRIGGER_CLASS}>
                <SelectValue placeholder={lang === "ar" ? "جميع الحالات" : "All"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === "ar" ? "جميع الحالات" : "All"}</SelectItem>
                {ADDITION_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 7. Funding */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-gray-500">{lang === "ar" ? "التمويل:" : "Funding:"}</span>
            <Select value={fundingStatus} onValueChange={(v) => setFundingStatus(v ?? "all")}>
              <SelectTrigger className={FILTER_TRIGGER_CLASS}>
                <SelectValue placeholder={lang === "ar" ? "جميع حالات التمويل" : "All"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === "ar" ? "جميع حالات التمويل" : "All"}</SelectItem>
                {FUNDING_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear */}
          {hasFilters && (
            <div className="flex flex-col justify-end">
              <Button variant="ghost" size="icon" onClick={onClear} className="text-gray-400">
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Hook to build filter params from the 7-filter state ─────────────────

function useFilterState() {
  const [organizer, setOrganizer] = useState("");
  const [tiers, setTiers] = useState<string[]>([]);
  const [eventTypesAr, setEventTypesAr] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [additionStatus, setAdditionStatus] = useState("");
  const [fundingStatus, setFundingStatus] = useState("");
  const [inclusionStatus, setInclusionStatus] = useState("");

  const clearAll = () => {
    setOrganizer("");
    setTiers([]);
    setEventTypesAr([]);
    setCities([]);
    setAdditionStatus("");
    setFundingStatus("");
    setInclusionStatus("");
  };

  const filterParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (organizer) params.organizer = organizer;
    if (tiers.length > 0) params.tier = tiers.join(",");
    if (eventTypesAr.length > 0) params.event_type_ar = eventTypesAr.join(",");
    if (cities.length > 0) params.city = cities.join(",");
    if (additionStatus) params.addition_status = additionStatus;
    if (fundingStatus) params.funding_status = fundingStatus;
    if (inclusionStatus) params.inclusion_status = inclusionStatus;
    return params;
  }, [organizer, tiers, eventTypesAr, cities, additionStatus, fundingStatus, inclusionStatus]);

  return {
    organizer, setOrganizer,
    tiers, setTiers,
    eventTypesAr, setEventTypesAr,
    cities, setCities,
    additionStatus, setAdditionStatus,
    fundingStatus, setFundingStatus,
    inclusionStatus, setInclusionStatus,
    clearAll,
    filterParams,
  };
}

function NoData() {
  return <p className="py-8 text-center text-sm text-slate-400">لا توجد بيانات</p>;
}

// ─── Dashboard Tab ─────────────────────────────────────

function DashboardTab() {
  const { language: lang } = useAuthStore();
  const filters = useFilterState();

  const { data: apiData, isLoading } = useDashboard(filters.filterParams);
  const { data: initiativesData } = useInitiatives({
    ...filters.filterParams,
    per_page: 2000,
  });

  // Build organizer options from apiData
  const organizerOptions = useMemo(() => {
    if (!apiData?.top_organizers) return [];
    return apiData.top_organizers.slice(0, 20).map((o: { name: string; count: number }) => ({
      value: o.name,
      label: `${o.name} (${o.count})`,
    }));
  }, [apiData?.top_organizers]);

  if (isLoading) return <SkeletonPage />;
  if (!apiData) return null;

  const byCity = apiData.initiatives.by_city;
  const byEventTypeAr = apiData.initiatives.by_event_type_ar;
  const byTier = apiData.initiatives.by_tier;
  const initiatives = initiativesData?.items ?? [];

  const cityData = Object.entries(byCity)
    .filter(([name]) => name !== "")
    .map(([name, count]) => ({ name, count: count as number }))
    .sort((a, b) => b.count - a.count);

  const typeData = byEventTypeAr
    ? Object.entries(byEventTypeAr)
        .map(([name, count]) => ({ key: name, name, count: count as number }))
        .filter((d) => d.count > 0)
    : [];

  const monthNames = lang === "ar" ? MONTH_NAMES_AR : MONTH_NAMES_EN;
  const tierData = EVENT_TIERS.map((tier) => ({
    name: tier.label,
    count: byTier?.[tier.value] ?? 0,
    color: getTierColorNeutral(tier.value),
  })).filter((item) => item.count > 0);

  const topOwners = Object.entries(
    initiatives.reduce<Record<string, number>>((acc, initiative) => {
      const owner = getEventOwner(initiative);
      if (owner && owner !== "—") acc[owner] = (acc[owner] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const inclusionData = [
    { name: "تضمن", value: initiatives.filter((item) => getInclusionStatus(item) === "تضمن").length, color: getInclusionColor("تضمن") },
    { name: "تحسب بدون تضمين", value: initiatives.filter((item) => getInclusionStatus(item) === "تحسب بدون تضمين").length, color: getInclusionColor("تحسب بدون تضمين") },
    { name: "لا تضمن", value: initiatives.filter((item) => ["لا تضمن", "لن تضمن"].includes(getInclusionStatus(item))).length, color: getInclusionColor("لا تضمن") },
  ].filter((item) => item.value > 0);

  const fundingData = [
    { name: "ممولة", value: initiatives.filter((item) => ["ممول", "ممولة"].includes(getFundingStatus(item))).length, color: getFundingColor("ممولة") },
    { name: "غير ممولة", value: initiatives.filter((item) => ["غير ممول", "غير ممولة"].includes(getFundingStatus(item))).length, color: getFundingColor("غير ممولة") },
  ].filter((item) => item.value > 0);

  const additionStages = ["أساس", "مضاف 1", "مضاف 2", "ملغي"];
  const additionData = additionStages.map((stage) => {
    const count = initiatives.filter((item) => getAdditionStatus(item) === stage).length;
    return { name: stage, count };
  });

  const byMonth = apiData.initiatives.by_month || {};

  // Event counts per month from server-side aggregation
  const monthlyEventCounts = monthNames.map((name, monthIndex) => {
    const monthNum = monthIndex + 1;
    return {
      name,
      total: (byMonth[monthNum] ?? 0) as number,
    };
  });

  // Daily density heatmap (days with 0/1/2+ concurrent events)
  const monthlyHeatmap = monthNames.map((name, monthIndex) => {
    const daysInMonth = new Date(2026, monthIndex + 1, 0).getDate();
    const counts = Array(daysInMonth).fill(0);

    initiatives.forEach((initiative) => {
      if (!initiative.start_date) return;
      const start = new Date(initiative.start_date);
      const end = initiative.end_date ? new Date(initiative.end_date) : new Date(initiative.start_date);
      const cursor = new Date(start);

      while (cursor <= end) {
        if (cursor.getFullYear() === 2026 && cursor.getMonth() === monthIndex) {
          counts[cursor.getDate() - 1] += 1;
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    });

    return {
      name,
      total: counts.filter((count) => count > 0).length,
      zero: counts.filter((count) => count === 0).length,
      one: counts.filter((count) => count === 1).length,
      twoPlus: counts.filter((count) => count >= 2).length,
    };
  });

  return (
    <div className="space-y-5">
      <FilterBar
        {...filters}
        organizerOptions={organizerOptions}
        lang={lang}
        onClear={filters.clearAll}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#1a365d]">
              {lang === "ar" ? "توزيع الفعاليات حسب المدينة" : "Events by City"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cityData.length === 0 && <NoData />}
              {cityData.map((city) => {
                const pct = apiData.initiatives.total > 0 ? (city.count / apiData.initiatives.total) * 100 : 0;
                return (
                  <div key={city.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{city.name}</span>
                      <span className="font-semibold text-gray-900">{formatNumberLocale(city.count)}</span>
                    </div>
                    <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2E75B6] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#1a365d]">
              {lang === "ar" ? "توزيع الفعاليات حسب النوع" : "Events by Type"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="count" nameKey="name">
                    {typeData.map((item) => (
                      <Cell key={item.key} fill={getTypeColor(item.name)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, _name: any, props: any) => [formatNumberLocale(Number(value)), props?.payload?.name ?? ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {typeData.map((item) => (
                <div key={item.key} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getTypeColor(item.name) }} />
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-bold">{formatNumberLocale(item.count)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#1a365d]">توزيع الفعاليات حسب التصنيف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={tierData} dataKey="count" nameKey="name" cx="50%" cy="45%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                    {tierData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, _name: any, props: any) => [formatNumberLocale(Number(value)), props?.payload?.name ?? ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-8 flex-wrap">
              {tierData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-bold">{formatNumberLocale(item.count)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#1a365d]">توزيع الفعاليات حسب الجهة المالكة</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: Math.max(420, topOwners.length * 28 + 30) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topOwners} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={260}
                    orientation="right"
                    tick={({ x, y, payload }: any) => {
                      const label = payload.value.length > 40 ? payload.value.slice(0, 38) + "\u2026" : payload.value;
                      return <text x={x} y={y} dy={4} textAnchor="start" fill="#374151" fontSize={11}>{label}</text>;
                    }}
                    interval={0}
                    tickLine={false}
                  />
                  <Tooltip formatter={(value: any) => [formatNumberLocale(Number(value)), "عدد الفعاليات"]} />
                  <Bar dataKey="count" fill="#1D4ED8" radius={[8, 8, 8, 8]} name="عدد الفعاليات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="border-gray-100 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#1a365d]">حالة الإضافة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={additionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" reversed />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [formatNumberLocale(Number(value)), "عدد الفعاليات"]} />
                  <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} name="عدد الفعاليات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#1a365d]">حالة التضمين</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inclusionData.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  <span className="text-sm font-bold text-slate-900">{formatNumberLocale(item.value)}</span>
                </div>
                <div className="h-3 rounded-full" style={{ backgroundColor: item.color }} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#1a365d]">حالة التمويل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={fundingData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {fundingData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, _name: any, props: any) => [formatNumberLocale(Number(value)), props?.payload?.name ?? ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {fundingData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-bold">{formatNumberLocale(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#1a365d]">توزيع الفعاليات حسب الشهر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...monthlyEventCounts].reverse()} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} width={40} />
                  <Tooltip formatter={(value: any) => [formatNumberLocale(Number(value)), "عدد الفعاليات"]} />
                  <Bar dataKey="total" fill="#2563EB" radius={[6, 6, 0, 0]} name="عدد الفعاليات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Heatmap — rows per category, columns per month */}
            <div className="overflow-x-auto">
              <div className="min-w-[680px]">
                {/* Month headers */}
                <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: "minmax(170px,auto) repeat(12, 1fr)" }}>
                  <div />
                  {[...monthlyHeatmap].reverse().map((month) => (
                    <div key={month.name} className="text-center text-[10px] font-semibold text-slate-700 pb-1">{month.name}</div>
                  ))}
                </div>
                {/* فارغ row */}
                <div className="grid gap-1 items-center py-1 rounded-lg hover:bg-slate-50" style={{ gridTemplateColumns: "minmax(170px,auto) repeat(12, 1fr)" }}>
                  <div className="text-[10px] text-slate-400 font-medium pe-3 text-start">أيام لا تقام بها أي فعاليات</div>
                  {[...monthlyHeatmap].reverse().map((month) => (
                    <div key={month.name} className="text-center text-[10px] text-slate-400 font-semibold">{month.zero}</div>
                  ))}
                </div>
                {/* واحد row */}
                <div className="grid gap-1 items-center py-1 rounded-lg hover:bg-slate-50" style={{ gridTemplateColumns: "minmax(170px,auto) repeat(12, 1fr)" }}>
                  <div className="text-[10px] text-blue-500 font-medium pe-3 text-start">أيام تقام فيها فعالية واحدة فقط</div>
                  {[...monthlyHeatmap].reverse().map((month) => (
                    <div key={month.name} className="text-center text-[10px] text-blue-500 font-semibold">{month.one}</div>
                  ))}
                </div>
                {/* متعدد row */}
                <div className="grid gap-1 items-center py-1 rounded-lg hover:bg-slate-50" style={{ gridTemplateColumns: "minmax(170px,auto) repeat(12, 1fr)" }}>
                  <div className="text-[10px] text-orange-500 font-medium pe-3 text-start">أيام تقام فيها فعاليتان أو أكثر</div>
                  {[...monthlyHeatmap].reverse().map((month) => (
                    <div key={month.name} className="text-center text-[10px] text-orange-500 font-semibold">{month.twoPlus}</div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Initiatives List Tab ─────────────────────────────────────

function InitiativesList({ initialDateFrom = "", initialDateTo = "" }: { initialDateFrom?: string; initialDateTo?: string }) {
  const { language: lang } = useAuthStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);
  const filters = useFilterState();

  // Sync when parent changes initial dates (e.g. calendar day click)
  React.useEffect(() => { setDateFrom(initialDateFrom); }, [initialDateFrom]);
  React.useEffect(() => { setDateTo(initialDateTo); }, [initialDateTo]);

  // Reset to page 1 when search or filters change
  const prevSearchRef = React.useRef(search);
  const prevFiltersRef = React.useRef(filters.filterParams);
  if (prevSearchRef.current !== search || JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters.filterParams)) {
    prevSearchRef.current = search;
    prevFiltersRef.current = filters.filterParams;
    if (page !== 1) setPage(1);
  }

  // Fetch organizer options from dashboard (unfiltered for the full list)
  const { data: dashData } = useDashboard();
  const organizerOptions = useMemo(() => {
    if (!dashData?.top_organizers) return [];
    return dashData.top_organizers.slice(0, 20).map((o: { name: string; count: number }) => ({
      value: o.name,
      label: `${o.name} (${o.count})`,
    }));
  }, [dashData?.top_organizers]);

  const queryParams = useMemo(() => {
    const params: Record<string, string | number | boolean | undefined> = { per_page: 50, page };
    if (search) params.search = search;
    if (dateFrom) params.start_date = dateFrom;
    if (dateTo) params.end_date = dateTo;
    // Merge 7-filter params
    for (const [k, v] of Object.entries(filters.filterParams)) {
      params[k] = v;
    }
    return params;
  }, [search, dateFrom, dateTo, filters.filterParams, page]);

  const { data: apiData, isLoading, isError } = useInitiatives(queryParams);

  const initiatives = useMemo(() => {
    return apiData?.items ?? [];
  }, [apiData]);

  const hasFilters = search || dateFrom || dateTo || Object.keys(filters.filterParams).length > 0;

  const clearAll = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    filters.clearAll();
  };

  const handleExportCSV = () => {
    const HEADERS = ["اسم الفعالية", "الجهة المسؤولة", "المدينة", "التصنيف", "النوع", "تاريخ البداية", "تاريخ النهاية", "حالة التضمين"];
    const rows = initiatives.map((init) => {
      const tier = (init as unknown as Record<string, unknown>).tier as string | undefined;
      const eventTypeAr = (init as unknown as Record<string, unknown>).event_type_ar as string | undefined;
      const inclusionStatus = (init as unknown as Record<string, unknown>).inclusion_status as string | undefined;
      const organizer = (init as unknown as Record<string, unknown>).organizer as string | undefined;
      const TIER_AR: Record<string, string> = {
        Marquee: "مرموق",
        "Tier 1": "الفئة 1",
        "Tier 2": "الفئة 2",
        "Tier 3": "الفئة 3",
      };
      return [
        init.title_ar || "",
        organizer || "",
        init.city_ar || "",
        tier ? (TIER_AR[tier] || tier) : "",
        eventTypeAr || INITIATIVE_TYPES.find((tp) => tp.value === init.initiative_type)?.label_ar || "",
        init.start_date ? init.start_date.substring(0, 10) : "",
        init.end_date ? init.end_date.substring(0, 10) : "",
        inclusionStatus || "",
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
    });
    const csv = "\uFEFF" + [HEADERS.join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `فعاليات_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">
        {formatNumberLocale(apiData?.total ?? initiatives.length)} {l("eventsCount", lang)} {hasFilters ? l("filtered", lang) : ""}
      </div>

      {/* Search + Filters */}
      <Card className="border-gray-100">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            {/* Search + date row */}
            <div className="flex flex-wrap gap-3 items-end">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={l("search", lang)}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ps-9"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-gray-500">{lang === "ar" ? "من تاريخ:" : "From Date:"}</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-gray-500">{lang === "ar" ? "إلى تاريخ:" : "To Date:"}</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              {hasFilters && (
                <Button variant="ghost" size="icon" onClick={clearAll} className="text-gray-400 self-end">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <FilterBar
              {...filters}
              organizerOptions={organizerOptions}
              lang={lang}
              onClear={clearAll}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-100">
        <CardContent className="p-0">
          {isLoading ? (
            <SkeletonTable rows={8} />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 p-6">
              <X className="w-8 h-8 text-red-400" />
              <p className="text-sm text-gray-500 text-center">تعذّر تحميل بيانات الفعاليات. تحقق من الاتصال بالخادم أو أعد المحاولة.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">{lang === "ar" ? "اسم الفعالية" : "Event"}</TableHead>
                    <TableHead className="w-[200px]">{lang === "ar" ? "الجهة المسؤولة" : "Organizer"}</TableHead>
                    <TableHead>{lang === "ar" ? "وصف الفعالية" : "Description"}</TableHead>
                    <TableHead>{lang === "ar" ? "عدد الأيام" : "Days"}</TableHead>
                    <TableHead>{lang === "ar" ? "التصنيف" : "Tier"}</TableHead>
                    <TableHead>{lang === "ar" ? "النوع" : "Type"}</TableHead>
                    <TableHead>{lang === "ar" ? "المدينة" : "City"}</TableHead>
                    <TableHead>{lang === "ar" ? "الفئة الفرعية" : "Subcategory"}</TableHead>
                    <TableHead>{lang === "ar" ? "حالة الإضافة" : "Addition Status"}</TableHead>
                    <TableHead>{lang === "ar" ? "حالة التمويل" : "Funding Status"}</TableHead>
                    <TableHead>{lang === "ar" ? "التواصل" : "Continuity"}</TableHead>
                    <TableHead>{lang === "ar" ? "فترة الإقامة" : "Residency Period"}</TableHead>
                    <TableHead>{lang === "ar" ? "حالة التضمين" : "Inclusion Status"}</TableHead>
                    <TableHead>{lang === "ar" ? "سبب الاستبعاد" : "Exclusion Reason"}</TableHead>
                    <TableHead>{lang === "ar" ? "مكان إقامة الفعالية" : "Event Location"}</TableHead>
                    <TableHead>{lang === "ar" ? "رابط الفعالية" : "Event Link"}</TableHead>
                    <TableHead>{lang === "ar" ? "الميزانية" : "Budget"}</TableHead>
                    <TableHead>{lang === "ar" ? "تاريخ البداية" : "Start Date"}</TableHead>
                    <TableHead>{lang === "ar" ? "تاريخ النهاية" : "End Date"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initiatives.map((initiative) => (
                    <TableRow key={initiative.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{t(initiative, "title", lang)}</div>
                      </TableCell>
                      <TableCell className="text-sm">{getEventOwner(initiative)}</TableCell>
                      <TableCell className="max-w-[280px] text-sm text-gray-600">
                        <span className="line-clamp-2">{t(initiative, "description", lang) || "—"}</span>
                      </TableCell>
                      <TableCell className="text-sm">{getEventDays(initiative)}</TableCell>
                      <TableCell className="text-sm">
                        {(() => {
                          const tier = getEventTier(initiative);
                          if (!tier) return "—";
                          return (
                            <span
                              className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-white"
                              style={{ backgroundColor: getTierColor(tier, getEventTypeLabel(initiative, "ar")) }}
                            >
                              {tier}
                            </span>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="text-sm font-medium" style={{ color: getTypeColor(getEventTypeLabel(initiative, "ar")) }}>
                        {getEventTypeLabel(initiative, lang)}
                      </TableCell>
                      <TableCell className="text-sm">{t(initiative, "city", lang)}</TableCell>
                      <TableCell className="text-sm">{getSubcategory(initiative)}</TableCell>
                      <TableCell className="text-sm">{getAdditionStatus(initiative)}</TableCell>
                      <TableCell className="text-sm">
                        <span
                          className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-white"
                          style={{ backgroundColor: getFundingColor(getFundingStatus(initiative)) }}
                        >
                          {getFundingStatus(initiative)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{getContinuityStatus(initiative)}</TableCell>
                      <TableCell className="text-sm">{getAdditionalField(initiative, "residency_period", "فترة الإقامة") || "—"}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <span
                          className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-slate-800"
                          style={{ backgroundColor: getInclusionColor(getInclusionStatus(initiative)) }}
                        >
                          {getInclusionStatus(initiative)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{getExclusionReason(initiative)}</TableCell>
                      <TableCell className="text-sm">{getEventVenue(initiative, lang)}</TableCell>
                      <TableCell className="text-sm">
                        {getEventLink(initiative) ? (
                          <a href={getEventLink(initiative)} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                            {lang === "ar" ? "فتح الرابط" : "Open"}
                          </a>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-sm">{getBudgetValue(initiative) || "—"}</TableCell>
                      <TableCell className="text-sm text-gray-600">{initiative.start_date ? formatDate(initiative.start_date, lang) : "—"}</TableCell>
                      <TableCell className="text-sm text-gray-600">{initiative.end_date ? formatDate(initiative.end_date, lang) : "—"}</TableCell>
                    </TableRow>
                  ))}
                  {initiatives.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={20} className="text-center py-12 text-gray-400">
                        {l("noResults", lang)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {apiData && apiData.pages > 1 && (
        <div className="flex items-center justify-between gap-4 py-2">
          <span className="text-xs text-gray-500">
            {lang === "ar"
              ? `الصفحة ${page} من ${apiData.pages} · إجمالي ${apiData.total} فعالية`
              : `Page ${page} of ${apiData.pages} · ${apiData.total} total`}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="h-8 px-2 text-xs"
            >
              {lang === "ar" ? "الأولى" : "First"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 px-3 text-xs"
            >
              {lang === "ar" ? "السابق" : "Prev"}
            </Button>
            {Array.from({ length: Math.min(5, apiData.pages) }, (_, i) => {
              const mid = Math.min(Math.max(page, 3), apiData.pages - 2);
              const p = apiData.pages <= 5 ? i + 1 : mid - 2 + i;
              if (p < 1 || p > apiData.pages) return null;
              return (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 text-xs p-0 ${p === page ? "bg-[#1a365d] text-white" : ""}`}
                >
                  {p}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(apiData.pages, p + 1))}
              disabled={page === apiData.pages}
              className="h-8 px-3 text-xs"
            >
              {lang === "ar" ? "التالي" : "Next"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(apiData.pages)}
              disabled={page === apiData.pages}
              className="h-8 px-2 text-xs"
            >
              {lang === "ar" ? "الأخيرة" : "Last"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Calendar View Tab ─────────────────────────────────────

function CalendarView({ onDayClick }: { onDayClick?: (date: string) => void }) {
  const { language: lang } = useAuthStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(2026);
  const filters = useFilterState();

  // Fetch organizer options from dashboard
  const { data: dashData } = useDashboard();
  const organizerOptions = useMemo(() => {
    if (!dashData?.top_organizers) return [];
    return dashData.top_organizers.slice(0, 20).map((o: { name: string; count: number }) => ({
      value: o.name,
      label: `${o.name} (${o.count})`,
    }));
  }, [dashData?.top_organizers]);

  const queryParams = useMemo(() => {
    const params: Record<string, string | number | boolean | undefined> = {
      per_page: 500,
      start_date: `${selectedYear}-01-01`,
      end_date: `${selectedYear}-12-31`,
    };
    // Merge 7-filter params
    for (const [k, v] of Object.entries(filters.filterParams)) {
      params[k] = v;
    }
    return params;
  }, [selectedYear, filters.filterParams]);

  const { data: apiData, isLoading } = useInitiatives(queryParams);

  const monthNames = lang === "ar"
    ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const dayNames = lang === "ar"
    ? ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const initiatives = apiData?.items || [];

  // Each entry tracks whether this is the event's actual start day
  type DayEventEntry = { event: Initiative; isStart: boolean };

  // Span events across all days from start_date to end_date within the selected month
  const monthEvents = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const eventsMap: Record<number, DayEventEntry[]> = {};

    for (const init of initiatives) {
      if (!init.start_date) continue;

      // Parse without timezone issues
      const sp = init.start_date.substring(0, 10).split("-");
      const sYear = parseInt(sp[0], 10), sMonth = parseInt(sp[1], 10) - 1, sDay = parseInt(sp[2], 10);

      const endStr = init.end_date || init.start_date;
      const ep = endStr.substring(0, 10).split("-");
      const eYear = parseInt(ep[0], 10), eMonth = parseInt(ep[1], 10) - 1, eDay = parseInt(ep[2], 10);

      // Skip events that don't overlap the current month
      const startsBeforeOrInMonth = sYear < selectedYear || (sYear === selectedYear && sMonth <= selectedMonth);
      const endsAfterOrInMonth = eYear > selectedYear || (eYear === selectedYear && eMonth >= selectedMonth);
      if (!startsBeforeOrInMonth || !endsAfterOrInMonth) continue;

      // Clip range to current month's days
      const dayFrom = (sYear === selectedYear && sMonth === selectedMonth) ? sDay : 1;
      const dayTo = (eYear === selectedYear && eMonth === selectedMonth) ? eDay : daysInMonth;

      for (let d = dayFrom; d <= dayTo; d++) {
        if (!eventsMap[d]) eventsMap[d] = [];
        eventsMap[d].push({
          event: init,
          isStart: d === sDay && sMonth === selectedMonth && sYear === selectedYear,
        });
      }
    }
    return eventsMap;
  }, [initiatives, selectedMonth, selectedYear]);

  // Build calendar grid
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week); }

  // Color event pills by Arabic event type
  const getEventPillColor = (init: Initiative) => {
    const eventTypeAr = getEventTypeLabel(init, "ar");
    if (eventTypeAr === "أعمال") return "bg-blue-500";
    if (eventTypeAr === "ترفيه") return "bg-orange-400";
    return "bg-gray-400";
  };

  if (isLoading) return <SkeletonPage />;

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <FilterBar
        {...filters}
        organizerOptions={organizerOptions}
        lang={lang}
        onClear={filters.clearAll}
      />

      {/* Year selector */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-medium text-gray-500">{lang === "ar" ? "السنة:" : "Year:"}</span>
        <Select value={String(selectedYear)} onValueChange={(v) => { if (v) setSelectedYear(Number(v)); }}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEAR_OPTIONS.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Month selector */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setSelectedMonth((m) => m > 0 ? m - 1 : 11)}>
          {lang === "ar" ? "\u2192" : "\u2190"}
        </Button>
        <h3 className="text-lg font-bold text-[#1a365d]">
          {monthNames[selectedMonth]} {selectedYear}
        </h3>
        <Button variant="outline" size="sm" onClick={() => setSelectedMonth((m) => m < 11 ? m + 1 : 0)}>
          {lang === "ar" ? "\u2190" : "\u2192"}
        </Button>
      </div>

      {/* Calendar grid */}
      <Card className="border-gray-100">
        <CardContent className="p-0">
          <div className="grid grid-cols-7">
            {dayNames.map((d) => (
              <div key={d} className="p-2 text-center text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                {d}
              </div>
            ))}
            {weeks.flat().map((day, i) => {
              const entries = day ? (monthEvents[day] || []) : [];
              const startEntries = entries.filter((e) => e.isStart);
              const contEntries = entries.filter((e) => !e.isStart);
              const dateStr = day
                ? `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : null;
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-24 border-b border-e border-gray-100 p-1 transition-colors",
                    !day && "bg-gray-50/50",
                    day && onDayClick && "cursor-pointer hover:bg-blue-50/60"
                  )}
                  onClick={() => {
                    if (day && onDayClick && dateStr) onDayClick(dateStr);
                  }}
                >
                  {day && (
                    <>
                      <span className={cn(
                        "text-xs font-medium",
                        entries.length > 0 ? "text-blue-700" : "text-gray-400"
                      )}>
                        {day}
                      </span>
                      <div className="mt-0.5 space-y-0.5">
                        {/* Start-day events: full labelled pill */}
                        {startEntries.slice(0, 3).map((entry, j) => (
                          <div key={j} className={cn(
                            "text-[9px] px-1 py-0.5 rounded truncate text-white",
                            getEventPillColor(entry.event)
                          )} title={t(entry.event, "title", lang)}>
                            {t(entry.event, "title", lang)}
                          </div>
                        ))}
                        {/* Continuation events: thin semi-transparent bar, no label */}
                        {contEntries.length > 0 && startEntries.length < 3 && (
                          <div className="flex flex-col gap-0.5 mt-0.5">
                            {contEntries.slice(0, 3 - startEntries.length).map((entry, j) => (
                              <div
                                key={j}
                                className={cn("h-1.5 w-full rounded-sm opacity-40", getEventPillColor(entry.event))}
                                title={t(entry.event, "title", lang)}
                              />
                            ))}
                          </div>
                        )}
                        {entries.length > 3 && (
                          <span className="text-[9px] text-gray-400">
                            +{entries.length - 3} {lang === "ar" ? "أخرى" : "more"}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly summary */}
      <Card className="border-gray-100">
        <CardContent className="p-4">
          {(() => {
            const allEntries = Object.values(monthEvents).flat();
            const activeCount = new Set(allEntries.map((e) => e.event.id)).size;
            const startCount = allEntries.filter((e) => e.isStart).length;
            return (
              <p className="text-sm text-gray-600">
                {lang === "ar"
                  ? `الفعاليات النشطة في ${monthNames[selectedMonth]}: ${activeCount} فعالية (${startCount} تبدأ هذا الشهر)`
                  : `Active events in ${monthNames[selectedMonth]}: ${activeCount} (${startCount} starting this month)`}
              </p>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page Export ─────────────────────────────────────

export default function InitiativesPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleDayClick = (date: string) => {
    setDateFrom(date);
    setDateTo(date);
    setActiveTab("list");
  };

  return (
    <WorkstreamLayout
      title_ar={ws.name_ar}
      title_en={ws.name_en}
      subtitle_ar="إدارة الفعاليات والمبادرات عبر المدن السعودية"
      subtitle_en="Manage events and initiatives across Saudi cities"
      color={ws.color}
      workstreamId="city-calendars"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={[
        {
          id: "overview",
          label_ar: "نظرة عامة",
          label_en: "Overview",
          icon: LayoutDashboard,
          content: <WorkstreamOverviewPanel workstreamId="city-calendars" accentColor={ws.color} />,
        },
        {
          id: "dashboard",
          label_ar: "لوحة التحكم",
          label_en: "Dashboard",
          icon: BarChart3,
          content: <DashboardTab />,
        },
        {
          id: "list",
          label_ar: "بيانات الفعاليات",
          label_en: "Events Data",
          icon: List,
          content: <InitiativesList initialDateFrom={dateFrom} initialDateTo={dateTo} />,
        },
        {
          id: "calendar",
          label_ar: "التقويم",
          label_en: "Calendar",
          icon: CalendarDays,
          content: <CalendarView onDayClick={handleDayClick} />,
        },
        {
          id: "ai-chat",
          label_ar: "موظفي الذكاء الاصطناعي",
          label_en: "AI Staff",
          icon: Bot,
          content: null,
        },
      ]}
      chatWelcome_ar="مرحبا! يمكنني تحليل تقاويم الفعاليات للمدن الخمس، مقارنة التوزيع، واكتشاف التعارضات."
      chatWelcome_en="Hi! I can analyze event calendars across 5 cities, compare distributions, and detect conflicts."
      chatSuggestions_ar={[
        "حلل فعاليات المدن الخمس",
        "ما هو توزيع الفعاليات حسب التصنيف؟",
        "قارن بين فعاليات الرياض وجدة",
        "ما هي الفعاليات القادمة في العلا؟",
      ]}
      chatSuggestions_en={[
        "Analyze events across all 5 cities",
        "What is the event distribution by tier?",
        "Compare Riyadh and Jeddah events",
        "What are upcoming events in AlUla?",
      ]}
    />
  );
}
