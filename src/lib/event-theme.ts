export const EVENT_TYPE_COLORS = {
  business: "#3B82F6",
  entertainment: "#F97316",
} as const;

export const TIER_COLOR_SCALE = {
  business: {
    Marquee: "#1D4ED8",
    "Tier 1": "#2563EB",
    "Tier 2": "#60A5FA",
    "Tier 3": "#BFDBFE",
  },
  entertainment: {
    Marquee: "#C2410C",
    "Tier 1": "#EA580C",
    "Tier 2": "#FB923C",
    "Tier 3": "#FED7AA",
  },
} as const;

export const TIER_COLORS_NEUTRAL: Record<string, string> = {
  Marquee: "#DC2626",
  "Tier 1": "#7C3AED",
  "Tier 2": "#14B8A6",
  "Tier 3": "#94A3B8",
} as const;

export function getTierColorNeutral(tier?: string | null) {
  if (!tier) return "#CBD5E1";
  return TIER_COLORS_NEUTRAL[tier] ?? "#CBD5E1";
}

export const INCLUSION_COLORS = {
  included: "#86EFAC",
  countedWithoutInclusion: "#D1D5DB",
  excluded: "#FCA5A5",
} as const;

export const FUNDING_COLORS = {
  funded: "#16A34A",
  unfunded: "#9CA3AF",
} as const;

export function normalizeEventType(value?: string | null) {
  if (value === "أعمال") return "business";
  if (value === "ترفيه") return "entertainment";
  return null;
}

export function getTypeColor(value?: string | null) {
  const type = normalizeEventType(value);
  if (!type) return "#94A3B8";
  return EVENT_TYPE_COLORS[type];
}

export function getTierColor(tier?: string | null, eventType?: string | null) {
  const type = normalizeEventType(eventType) ?? "business";
  if (!tier) return "#CBD5E1";
  return TIER_COLOR_SCALE[type][tier as keyof (typeof TIER_COLOR_SCALE)[typeof type]] ?? "#CBD5E1";
}

export function getInclusionColor(value?: string | null) {
  if (value === "تضمن") return INCLUSION_COLORS.included;
  if (value === "تحسب بدون تضمين") return INCLUSION_COLORS.countedWithoutInclusion;
  if (value === "لا تضمن" || value === "لن تضمن") return INCLUSION_COLORS.excluded;
  return "#CBD5E1";
}

export function getFundingColor(value?: string | null) {
  if (value === "ممول" || value === "ممولة") return FUNDING_COLORS.funded;
  if (value === "غير ممول" || value === "غير ممولة") return FUNDING_COLORS.unfunded;
  return "#CBD5E1";
}
