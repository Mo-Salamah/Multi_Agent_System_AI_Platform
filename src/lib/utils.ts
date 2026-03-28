import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Force Western/ASCII numerals (0-9). Replaces Arabic-Indic (٠-٩) and
 * Extended Arabic-Indic (۰-۹) digits with their Western equivalents.
 * CRITICAL: Use this on ALL user-facing numbers.
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value == null) return "0";
  return String(value)
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06F0));
}

/**
 * Format a number with locale-aware thousands separators, forced Western numerals.
 */
export function formatNumberLocale(value: number): string {
  return formatNumber(value.toLocaleString('en-US'));
}

/**
 * Bilingual text helper. Returns the Arabic or English version of a field
 * based on the current language preference.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function t(
  item: any,
  field: string,
  lang: 'ar' | 'en' = 'ar'
): string {
  if (lang === 'ar') {
    const arField = `${field}_ar`;
    if (arField in item && item[arField]) return String(item[arField]);
  }
  if (field in item && item[field]) return String(item[field]);
  // fallback
  const arField = `${field}_ar`;
  if (arField in item && item[arField]) return String(item[arField]);
  return '';
}

export function formatBudget(amount: number, lang: 'ar' | 'en' = 'ar'): string {
  if (amount >= 1_000_000) {
    const millions = formatNumber((amount / 1_000_000).toFixed(1));
    return lang === 'ar' ? `${millions} مليون ر.س` : `SAR ${millions}M`;
  }
  if (amount >= 1_000) {
    const thousands = formatNumber((amount / 1_000).toFixed(0));
    return lang === 'ar' ? `${thousands} ألف ر.س` : `SAR ${thousands}K`;
  }
  const val = formatNumber(String(amount));
  return lang === 'ar' ? `${val} ر.س` : `SAR ${val}`;
}

export function formatDate(dateStr: string | null | undefined, lang: 'ar' | 'en' = 'ar'): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const formatted = date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return formatNumber(formatted);
}
