// Mock data for the demo - all event names anonymized

// Arabic number words for naming
const arabicNumbers = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠", "١١", "١٢", "١٣", "١٤", "١٥", "١٦", "١٧", "١٨", "١٩", "٢٠", "٢١", "٢٢", "٢٣", "٢٤", "٢٥", "٢٦", "٢٧", "٢٨", "٢٩", "٣٠", "٣١", "٣٢", "٣٣", "٣٤", "٣٥", "٣٦", "٣٧", "٣٨", "٣٩", "٤٠", "٤١", "٤٢", "٤٣", "٤٤", "٤٥", "٤٦", "٤٧", "٤٨", "٤٩", "٥٠"];

// Generate 20 unique organizer names
const organizers = Array.from({ length: 20 }, (_, i) => `جهة ${arabicNumbers[i]}`);

// Cities distribution (matching real proportions roughly: Riyadh heavy, others lighter)
const cities = [
  { name_ar: "الرياض", name_en: "Riyadh", weight: 0.65 },
  { name_ar: "جدة", name_en: "Jeddah", weight: 0.12 },
  { name_ar: "العلا", name_en: "AlUla", weight: 0.08 },
  { name_ar: "عسير", name_en: "Aseer", weight: 0.09 },
  { name_ar: "حاضرة الدمام", name_en: "Dammam", weight: 0.06 },
];

const eventTypes = ["ترفيه", "أعمال"];
const tiers = ["Marquee", "Tier 1", "Tier 2", "Tier 3"];
const additionStatuses = ["أساس", "مضاف 1", "مضاف 2"];
const fundingStatuses = ["ممولة", "غير ممولة"];
const inclusionStatuses = ["تضمن", "تحسب بدون تضمين", "لا تضمن"];

// Seeded random for deterministic data
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const rand = seededRandom(42);

function pickWeighted<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let r = rand() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randomDate(year: number, month?: number): string {
  const m = month ?? Math.floor(rand() * 12) + 1;
  const d = Math.floor(rand() * 28) + 1;
  return `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// Generate 650 events (similar volume to real data)
export interface MockInitiative {
  id: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  initiative_type: string;
  event_type_ar: string;
  start_date: string;
  end_date: string;
  city: string;
  city_ar: string;
  status: string;
  tier: string;
  organizer: string;
  addition_status: string;
  funding_status: string;
  inclusion_status: string;
  estimated_budget: number;
  is_funded: boolean;
  additional_data: Record<string, string>;
  tags: string[];
  created_at: string;
}

export const MOCK_INITIATIVES: MockInitiative[] = Array.from({ length: 650 }, (_, i) => {
  const num = arabicNumbers[i % 50] || String(i + 1);
  const city = pickWeighted(cities);
  const startDate = randomDate(2026);
  const duration = Math.floor(rand() * 14) + 1;
  const eventType = pick(eventTypes);
  const tier = pick(tiers);
  const organizer = pick(organizers);
  const funded = rand() > 0.4;

  return {
    id: `init-${String(i + 1).padStart(4, "0")}`,
    title: `Event ${i + 1}`,
    title_ar: `فعالية ${num}${i >= 50 ? ` - ${Math.floor(i / 50) + 1}` : ""}`,
    description: "Event description",
    description_ar: "وصف الفعالية",
    initiative_type: eventType === "أعمال" ? "economic" : "entertainment",
    event_type_ar: eventType,
    start_date: startDate,
    end_date: addDays(startDate, duration),
    city: city.name_en,
    city_ar: city.name_ar,
    status: "approved",
    tier,
    organizer,
    addition_status: pick(additionStatuses),
    funding_status: funded ? "ممولة" : "غير ممولة",
    inclusion_status: pick(inclusionStatuses),
    estimated_budget: Math.floor(rand() * 5000000) + 100000,
    is_funded: funded,
    additional_data: {
      event_type_ar: eventType,
      الجهة_المسؤولة: organizer,
      حالة_الإضافة: pick(additionStatuses),
      حالة_التمويل: funded ? "ممولة" : "غير ممولة",
      حالة_التضمين: pick(inclusionStatuses),
    },
    tags: [],
    created_at: "2026-01-01T00:00:00Z",
  };
});

// Dashboard aggregation data
export function computeDashboardData(initiatives: MockInitiative[]) {
  const byCity: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const byEventTypeAr: Record<string, number> = {};
  const byTier: Record<string, number> = {};
  const byMonth: Record<number, number> = {};
  const byStatus: Record<string, number> = {};
  const organizerCounts: Record<string, number> = {};
  let totalBudget = 0;

  for (const init of initiatives) {
    byCity[init.city] = (byCity[init.city] || 0) + 1;
    byType[init.initiative_type] = (byType[init.initiative_type] || 0) + 1;
    byEventTypeAr[init.event_type_ar] = (byEventTypeAr[init.event_type_ar] || 0) + 1;
    byTier[init.tier] = (byTier[init.tier] || 0) + 1;
    byStatus[init.status] = (byStatus[init.status] || 0) + 1;
    organizerCounts[init.organizer] = (organizerCounts[init.organizer] || 0) + 1;
    totalBudget += init.estimated_budget;

    if (init.start_date) {
      const month = parseInt(init.start_date.split("-")[1], 10);
      byMonth[month] = (byMonth[month] || 0) + 1;
    }
  }

  const topOrganizers = Object.entries(organizerCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return {
    initiatives: {
      total: initiatives.length,
      by_status: byStatus,
      by_type: byType,
      by_event_type_ar: byEventTypeAr,
      by_city: byCity,
      by_tier: byTier,
      by_month: byMonth,
      total_budget: totalBudget,
    },
    top_organizers: topOrganizers,
    financial: {
      total_allocated: 45000000,
      total_actual_cost: 38500000,
      total_revenue: 12000000,
    },
    budget_summary: {
      total_estimated: totalBudget,
      total_allocated: 45000000,
      total_actual_cost: 38500000,
      total_revenue: 12000000,
      variance: 6500000,
    },
    performance: {
      avg_satisfaction: 4.2,
      total_attendance: 850000,
      total_target: 1000000,
    },
    pending_approvals: 3,
    recent_activity: [],
  };
}

// Financial reports (anonymized)
export interface MockFinancialReport {
  id: string;
  initiative_id: string;
  initiative_title: string;
  initiative_title_ar: string;
  reporting_period: string;
  budget_allocated: number;
  actual_cost: number;
  revenue: number;
  variance: number;
  variance_percentage: number;
  status: string;
}

export const MOCK_FINANCIAL_REPORTS: MockFinancialReport[] = [
  { id: "fr-1", initiative_id: "init-0001", initiative_title: "Event 1", initiative_title_ar: "فعالية ١", reporting_period: "Q1 2026", budget_allocated: 8500000, actual_cost: 7200000, revenue: 2100000, variance: 1300000, variance_percentage: 15.3, status: "approved" },
  { id: "fr-2", initiative_id: "init-0002", initiative_title: "Event 2", initiative_title_ar: "فعالية ٢", reporting_period: "Q1 2026", budget_allocated: 12000000, actual_cost: 11800000, revenue: 4500000, variance: 200000, variance_percentage: 1.7, status: "approved" },
  { id: "fr-3", initiative_id: "init-0003", initiative_title: "Event 3", initiative_title_ar: "فعالية ٣", reporting_period: "Q1 2026", budget_allocated: 3200000, actual_cost: 3500000, revenue: 800000, variance: -300000, variance_percentage: -9.4, status: "submitted" },
  { id: "fr-4", initiative_id: "init-0004", initiative_title: "Event 4", initiative_title_ar: "فعالية ٤", reporting_period: "Q1 2026", budget_allocated: 15000000, actual_cost: 12000000, revenue: 3200000, variance: 3000000, variance_percentage: 20.0, status: "approved" },
  { id: "fr-5", initiative_id: "init-0005", initiative_title: "Event 5", initiative_title_ar: "فعالية ٥", reporting_period: "Q1 2026", budget_allocated: 6300000, actual_cost: 4000000, revenue: 1400000, variance: 2300000, variance_percentage: 36.5, status: "draft" },
];

// Mock conversations for chat
export interface MockConversation {
  id: string;
  title: string;
  title_ar: string;
  messages: { role: "user" | "assistant"; content: string }[];
  created_at: string;
}

export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: "conv-1",
    title: "Conversation 1",
    title_ar: "محادثة ١",
    messages: [
      { role: "user", content: "مرحباً" },
      { role: "assistant", content: "يرجى الربط مع مزود خدمات سيرفرات ذكاء اصطناعي" },
    ],
    created_at: "2026-03-20T10:00:00Z",
  },
  {
    id: "conv-2",
    title: "Conversation 2",
    title_ar: "محادثة ٢",
    messages: [
      { role: "user", content: "ما هي الفعاليات القادمة؟" },
      { role: "assistant", content: "يرجى الربط مع مزود خدمات سيرفرات ذكاء اصطناعي" },
    ],
    created_at: "2026-03-21T14:00:00Z",
  },
  {
    id: "conv-3",
    title: "Conversation 3",
    title_ar: "محادثة ٣",
    messages: [
      { role: "user", content: "حلل بيانات التقاويم" },
      { role: "assistant", content: "يرجى الربط مع مزود خدمات سيرفرات ذكاء اصطناعي" },
    ],
    created_at: "2026-03-22T09:00:00Z",
  },
  {
    id: "conv-4",
    title: "Conversation 4",
    title_ar: "محادثة ٤",
    messages: [
      { role: "user", content: "أريد تقريراً مالياً" },
      { role: "assistant", content: "يرجى الربط مع مزود خدمات سيرفرات ذكاء اصطناعي" },
    ],
    created_at: "2026-03-23T16:00:00Z",
  },
  {
    id: "conv-5",
    title: "Conversation 5",
    title_ar: "محادثة ٥",
    messages: [
      { role: "user", content: "ما هي مؤشرات الأداء؟" },
      { role: "assistant", content: "يرجى الربط مع مزود خدمات سيرفرات ذكاء اصطناعي" },
    ],
    created_at: "2026-03-24T11:00:00Z",
  },
];

// Filter initiatives by overlap (correct date logic)
export function filterInitiatives(
  initiatives: MockInitiative[],
  filters: {
    search?: string;
    city_ar?: string;
    event_type_ar?: string;
    tier?: string;
    organizer?: string;
    addition_status?: string;
    funding_status?: string;
    inclusion_status?: string;
    start_date?: string;
    end_date?: string;
  }
): MockInitiative[] {
  return initiatives.filter((init) => {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!init.title_ar.toLowerCase().includes(s) && !init.description_ar.toLowerCase().includes(s)) return false;
    }
    if (filters.city_ar && filters.city_ar !== "all") {
      const filterCities = filters.city_ar.split(",");
      if (!filterCities.includes(init.city_ar)) return false;
    }
    if (filters.event_type_ar && filters.event_type_ar !== "all") {
      const filterTypes = filters.event_type_ar.split(",");
      if (!filterTypes.includes(init.event_type_ar)) return false;
    }
    if (filters.tier && filters.tier !== "all") {
      const filterTiers = filters.tier.split(",");
      if (!filterTiers.includes(init.tier)) return false;
    }
    if (filters.organizer && filters.organizer !== "all" && init.organizer !== filters.organizer) return false;
    if (filters.addition_status && filters.addition_status !== "all" && init.addition_status !== filters.addition_status) return false;
    if (filters.funding_status && filters.funding_status !== "all" && init.funding_status !== filters.funding_status) return false;
    if (filters.inclusion_status && filters.inclusion_status !== "all" && init.inclusion_status !== filters.inclusion_status) return false;

    // Date overlap logic: event overlaps filter range if event.start <= filter.end AND event.end >= filter.start
    if (filters.start_date && filters.end_date) {
      if (init.start_date > filters.end_date || init.end_date < filters.start_date) return false;
    } else if (filters.start_date) {
      if (init.end_date < filters.start_date) return false;
    } else if (filters.end_date) {
      if (init.start_date > filters.end_date) return false;
    }

    return true;
  });
}
