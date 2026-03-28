import {
  Calendar,
  BarChart3,
  Gamepad2,
  Landmark,
  FileText,
  HeadphonesIcon,
  DollarSign,
  type LucideIcon,
} from 'lucide-react';

export interface WorkstreamDefinition {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  href: string;
}

export const WORKSTREAMS: WorkstreamDefinition[] = [
  {
    id: 'city-calendars',
    name_ar: 'مسار إعداد تقاويم المدن',
    name_en: 'City Calendars Preparation',
    description_ar: 'التخطيط والإشراف على تقاويم الفعاليات للمدن السعودية — تنسيق المبادرات الثقافية والرياضية والترفيهية عبر الرياض وجدة والعلا وعسير وحاضرة الدمام',
    description_en: 'Planning and overseeing event calendars for Saudi cities — coordinating cultural, sports, and entertainment initiatives across Riyadh, Jeddah, AlUla, Aseer, and Dammam',
    icon: Calendar,
    color: '#2563eb',
    gradient: 'from-blue-600 to-blue-800',
    href: '/dashboard/calendar',
  },
  {
    id: 'financial',
    name_ar: 'مسار المتابعة المالية',
    name_en: 'Financial Monitoring',
    description_ar: 'متابعة الميزانيات والصرف والإيرادات لبنود التمويل الرئيسية — تحليل الانحرافات ومراقبة التدفقات النقدية',
    description_en: 'Track budgets, disbursements, and revenue for major funding line items — variance analysis and cashflow monitoring',
    icon: DollarSign,
    color: '#16a34a',
    gradient: 'from-green-600 to-green-800',
    href: '/dashboard/financial-monitoring',
  },
  {
    id: 'quality',
    name_ar: 'مسار الجودة',
    name_en: 'Quality & Performance',
    description_ar: 'مؤشرات الأداء الرئيسية ومراقبة الأداء وتقييم جودة الفعاليات',
    description_en: 'KPIs, performance monitoring, and quality assessment for events',
    icon: BarChart3,
    color: '#059669',
    gradient: 'from-emerald-600 to-emerald-800',
    href: '/dashboard/quality',
  },
  {
    id: 'esports',
    name_ar: 'مسار الرياضات الإلكترونية',
    name_en: 'eSports & International Hosting',
    description_ar: 'التفاوض مع أصحاب الحقوق الدولية لاستضافة بطولات ومسابقات الرياضات الإلكترونية في المملكة العربية السعودية',
    description_en: 'Negotiating with international IP owners to host eSports events and tournaments in Saudi Arabia',
    icon: Gamepad2,
    color: '#7c3aed',
    gradient: 'from-violet-600 to-violet-800',
    href: '/dashboard/esports',
  },
  {
    id: '300th-anniversary',
    name_ar: 'مسار احتفالية مرور 300 عام على تأسيس الدولة السعودية',
    name_en: '300th Saudi Founding Anniversary',
    description_ar: 'مكتب إدارة المشاريع للإشراف على البرنامج الوطني الكبير للاحتفال بمرور 300 عام على تأسيس الدولة السعودية',
    description_en: 'PMO oversight of the major national program celebrating 300 years of the Saudi state founding',
    icon: Landmark,
    color: '#d97706',
    gradient: 'from-amber-600 to-amber-800',
    href: '/dashboard/anniversary',
  },
  {
    id: 'documents',
    name_ar: 'مسار الوثائق والتعاميم',
    name_en: 'Documents & Circulars',
    description_ar: 'إدارة المراسلات الرسمية والتعاميم والتوجيهات الصادرة من اللجنة',
    description_en: 'Managing official correspondence, circulars, and directives issued by the committee',
    icon: FileText,
    color: '#dc2626',
    gradient: 'from-red-600 to-red-800',
    href: '/dashboard/documents',
  },
  {
    id: 'general-support',
    name_ar: 'مسار الدعم العام',
    name_en: 'General Support',
    description_ar: 'المساعدة العامة بالذكاء الاصطناعي — استفسارات متنوعة وتحليلات حسب الطلب ودراسات مقارنة معيارية',
    description_en: 'General AI assistance — ad-hoc queries, on-demand analysis, and benchmarking studies',
    icon: HeadphonesIcon,
    color: '#0891b2',
    gradient: 'from-cyan-600 to-cyan-800',
    href: '/dashboard/ai',
  },
];

export const CITIES = [
  { id: 'riyadh', name_ar: 'الرياض', name_en: 'Riyadh' },
  { id: 'jeddah', name_ar: 'جدة', name_en: 'Jeddah' },
  { id: 'alula', name_ar: 'العلا', name_en: 'AlUla' },
  { id: 'aseer', name_ar: 'عسير', name_en: 'Aseer' },
  { id: 'dammam', name_ar: 'حاضرة الدمام', name_en: 'Dammam' },
] as const;

export const INITIATIVE_TYPES = [
  { value: 'cultural', label_ar: 'ثقافية', label_en: 'Cultural' },
  { value: 'sports', label_ar: 'رياضية', label_en: 'Sports' },
  { value: 'entertainment', label_ar: 'ترفيهية', label_en: 'Entertainment' },
  { value: 'economic', label_ar: 'اقتصادية', label_en: 'Economic' },
  { value: 'social', label_ar: 'اجتماعية', label_en: 'Social' },
] as const;

export const INITIATIVE_STATUSES = [
  { value: 'draft', label_ar: 'مسودة', label_en: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { value: 'submitted', label_ar: 'مقدّمة', label_en: 'Submitted', color: 'bg-blue-100 text-blue-700' },
  { value: 'under_review', label_ar: 'قيد المراجعة', label_en: 'Under Review', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'approved', label_ar: 'معتمدة', label_en: 'Approved', color: 'bg-green-100 text-green-700' },
  { value: 'rejected', label_ar: 'مرفوضة', label_en: 'Rejected', color: 'bg-red-100 text-red-700' },
  { value: 'revision_requested', label_ar: 'مطلوب تعديل', label_en: 'Revision Requested', color: 'bg-orange-100 text-orange-700' },
  { value: 'pending', label_ar: 'قيد الانتظار', label_en: 'Pending', color: 'bg-blue-100 text-blue-700' },
] as const;

export const FUNDING_TYPES = [
  { value: 'government', label_ar: 'حكومي', label_en: 'Government' },
  { value: 'private', label_ar: 'خاص', label_en: 'Private' },
  { value: 'mixed', label_ar: 'مختلط', label_en: 'Mixed' },
] as const;

export const EVENT_TIERS = [
  { value: 'Marquee', label: 'Marquee' },
  { value: 'Tier 1', label: 'Tier 1' },
  { value: 'Tier 2', label: 'Tier 2' },
  { value: 'Tier 3', label: 'Tier 3' },
] as const;

export const EVENT_TYPES_AR = [
  { value: 'أعمال', label: 'أعمال' },
  { value: 'ترفيه', label: 'ترفيه' },
] as const;

export const ADDITION_STATUSES = [
  { value: 'أساس', label: 'أساس' },
  { value: 'مضاف 1', label: 'مضاف 1' },
  { value: 'مضاف 2', label: 'مضاف 2' },
  { value: 'ملغي', label: 'ملغي' },
] as const;

export const FUNDING_STATUSES = [
  { value: 'ممول', label: 'ممول' },
  { value: 'غير ممول', label: 'غير ممول' },
] as const;

export const INCLUSION_STATUSES = [
  { value: 'تضمن', label: 'تضمن' },
  { value: 'لن تضمن', label: 'لن تضمن' },
  { value: 'تحسب بدون تضمين', label: 'تحسب بدون تضمين' },
] as const;

export const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
  submitted: 'bg-blue-100 text-blue-700 border-blue-200',
  under_review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  revision_requested: 'bg-orange-100 text-orange-700 border-orange-200',
  pending: 'bg-blue-100 text-blue-700 border-blue-200',
};
