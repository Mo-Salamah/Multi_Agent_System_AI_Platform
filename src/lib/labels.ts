// P5: Bilingual labels for UI strings
const labels = {
  // Sidebar / Nav
  dashboard: { ar: "لوحة المعلومات", en: "Dashboard" },
  approvals: { ar: "الاعتمادات", en: "Approvals" },
  ai: { ar: "موظفي الذكاء الاصطناعي", en: "AI Employees" },
  settings: { ar: "الإعدادات", en: "Settings" },

  // Page titles
  dashboardSubtitle: { ar: "نظرة عامة على الفعاليات والمبادرات", en: "Overview of events and initiatives" },
  initiativesTitle: { ar: "مسار إعداد تقاويم المدن", en: "City Calendars Preparation" },
  initiativesSubtitle: { ar: "إدارة الفعاليات والمبادرات عبر المدن السعودية", en: "Manage events and initiatives across Saudi cities" },
  financialTitle: { ar: "مسار الجودة", en: "Quality Workstream" },
  financialSubtitle: { ar: "التقارير المالية ومؤشرات الأداء", en: "Financial reports and performance indicators" },
  approvalsSubtitle: { ar: "مراجعة واعتماد الطلبات المعلّقة", en: "Review and approve pending requests" },
  aiSubtitle: { ar: "الدردشة مع موظفي الذكاء الاصطناعي وتشغيل المهام التحليلية", en: "Chat with AI employees and run analytical tasks" },
  settingsSubtitle: { ar: "إعدادات الملف الشخصي واللغة", en: "Profile and language settings" },

  // Header
  platformTitle: { ar: "منصة الذكاء الاصطناعي", en: "AI Platform" },

  // Stat cards
  totalEvents: { ar: "إجمالي الفعاليات", en: "Total Events" },
  totalBudget: { ar: "إجمالي الميزانية", en: "Total Budget" },
  pendingApprovals: { ar: "اعتمادات معلّقة", en: "Pending Approvals" },
  avgSatisfaction: { ar: "متوسط الرضا", en: "Avg. Satisfaction" },

  // Charts
  byType: { ar: "الفعاليات حسب النوع", en: "Events by Type" },
  byCity: { ar: "الفعاليات حسب المدينة", en: "Events by City" },
  byMonth: { ar: "توزيع الفعاليات حسب الشهر", en: "Events by Month" },
  recentActivity: { ar: "آخر النشاطات", en: "Recent Activity" },
  statusDistribution: { ar: "حالة الفعاليات", en: "Event Status" },

  // Buttons
  newEvent: { ar: "فعالية جديدة", en: "New Event" },
  calendarView: { ar: "عرض التقويم", en: "Calendar View" },
  search: { ar: "بحث عن فعالية...", en: "Search events..." },
  allCities: { ar: "كل المدن", en: "All Cities" },
  allTypes: { ar: "كل الأنواع", en: "All Types" },
  allStatuses: { ar: "كل الحالات", en: "All Statuses" },
  runTask: { ar: "تشغيل المهمة", en: "Run Task" },
  running: { ar: "جاري التنفيذ...", en: "Running..." },
  approve: { ar: "اعتماد", en: "Approve" },
  reject: { ar: "رفض", en: "Reject" },
  requestRevision: { ar: "طلب تعديل", en: "Request Revision" },
  openChat: { ar: "فتح الدردشة", en: "Open Chat" },
  login: { ar: "تسجيل الدخول", en: "Log In" },
  backToList: { ar: "العودة إلى قائمة الفعاليات", en: "Back to events list" },
  requestAiRefinement: { ar: "تحسين بالذكاء الاصطناعي", en: "AI Refinement" },

  // Table headers
  event: { ar: "الفعالية", en: "Event" },
  city: { ar: "المدينة", en: "City" },
  type: { ar: "النوع", en: "Type" },
  date: { ar: "التاريخ", en: "Date" },
  budget: { ar: "الميزانية", en: "Budget" },
  status: { ar: "الحالة", en: "Status" },
  period: { ar: "الفترة", en: "Period" },
  allocated: { ar: "المخصص", en: "Allocated" },
  spent: { ar: "المنصرف", en: "Spent" },
  variancePct: { ar: "الفرق %", en: "Variance %" },

  // Financial tabs
  financialReports: { ar: "التقارير المالية", en: "Financial Reports" },
  performanceIndicators: { ar: "مؤشرات الأداء", en: "Performance Indicators" },
  totalAllocated: { ar: "إجمالي المخصص", en: "Total Allocated" },
  totalSpent: { ar: "إجمالي المنصرف", en: "Total Spent" },
  totalRevenue: { ar: "إجمالي الإيرادات", en: "Total Revenue" },
  netVariance: { ar: "صافي الفرق", en: "Net Variance" },
  surplus: { ar: "وفر", en: "Surplus" },
  overrun: { ar: "تجاوز", en: "Overrun" },
  totalAttendance: { ar: "إجمالي الحضور", en: "Total Attendance" },
  avgSatisfactionShort: { ar: "متوسط الرضا", en: "Avg. Satisfaction" },
  performanceRecords: { ar: "سجلات الأداء", en: "Performance Records" },
  attendance: { ar: "الحضور", en: "Attendance" },
  target: { ar: "المستهدف", en: "Target" },
  satisfaction: { ar: "الرضا", en: "Satisfaction" },

  // Statuses
  draft: { ar: "مسودة", en: "Draft" },
  submitted: { ar: "مقدّمة", en: "Submitted" },
  under_review: { ar: "قيد المراجعة", en: "Under Review" },
  approved: { ar: "معتمدة", en: "Approved" },
  rejected: { ar: "مرفوضة", en: "Rejected" },
  revision_requested: { ar: "مطلوب تعديل", en: "Revision Requested" },
  pending: { ar: "معلّقة", en: "Pending" },

  // Initiative types
  cultural: { ar: "ثقافية", en: "Cultural" },
  sports: { ar: "رياضية", en: "Sports" },
  entertainment: { ar: "ترفيهية", en: "Entertainment" },
  economic: { ar: "اقتصادية", en: "Economic" },
  social: { ar: "اجتماعية", en: "Social" },

  // Filters
  allTiers: { ar: "كل التصنيفات", en: "All Tiers" },
  tier: { ar: "التصنيف", en: "Tier" },
  year: { ar: "السنة", en: "Year" },
  allYears: { ar: "كل السنوات", en: "All Years" },
  funded: { ar: "التمويل", en: "Funding" },
  allFunding: { ar: "كل حالات التمويل", en: "All Funding" },
  fundedOnly: { ar: "ممولة", en: "Funded" },
  unfundedOnly: { ar: "غير ممولة", en: "Unfunded" },
  aiEmployees: { ar: "موظفي الذكاء الاصطناعي", en: "AI Employees" },
  overview: { ar: "نظرة عامة", en: "Overview" },
  notifications: { ar: "الإشعارات", en: "Notifications" },
  notificationsDesc: { ar: "إعدادات الإشعارات والتنبيهات", en: "Notification and alert settings" },
  emailNotifications: { ar: "إشعارات البريد الإلكتروني", en: "Email Notifications" },
  emailNotificationsDesc: { ar: "استلام إشعارات عبر البريد الإلكتروني عند تحديث الفعاليات", en: "Receive email notifications when events are updated" },
  browserNotifications: { ar: "إشعارات المتصفح", en: "Browser Notifications" },
  browserNotificationsDesc: { ar: "تلقي إشعارات فورية في المتصفح", en: "Receive instant browser push notifications" },
  weeklyReport: { ar: "التقرير الأسبوعي", en: "Weekly Report" },
  weeklyReportDesc: { ar: "استلام تقرير أسبوعي ملخّص بالبريد الإلكتروني", en: "Receive a weekly summary report by email" },
  defaultCity: { ar: "المدينة الافتراضية", en: "Default City" },
  defaultCityDesc: { ar: "المدينة المحددة مسبقاً في الفلاتر والتقارير", en: "Pre-selected city in filters and reports" },
  preferences: { ar: "التفضيلات", en: "Preferences" },
  preferencesDesc: { ar: "تخصيص تجربة المنصة", en: "Customize your platform experience" },
  defaultView: { ar: "العرض الافتراضي", en: "Default View" },
  dashboardView: { ar: "لوحة التحكم", en: "Dashboard" },
  calendarViewLabel: { ar: "التقويم", en: "Calendar" },
  listViewLabel: { ar: "قائمة الفعاليات", en: "Events List" },

  // Misc
  noResults: { ar: "لا توجد فعاليات تطابق معايير البحث", en: "No events match your search criteria" },
  filtered: { ar: "(مفلترة)", en: "(filtered)" },
  eventsCount: { ar: "فعالية", en: "events" },
  pendingCount: { ar: "طلب معلّق", en: "pending request(s)" },
  description: { ar: "الوصف", en: "Description" },
  aiRefinedDescription: { ar: "الوصف المحسّن بالذكاء الاصطناعي", en: "AI-Refined Description" },
  originalDescription: { ar: "الوصف الأصلي", en: "Original Description" },
  statusHistory: { ar: "سجل الحالة", en: "Status History" },
  decisionNotes: { ar: "ملاحظات القرار", en: "Decision Notes" },
  decisionNotesPlaceholder: { ar: "اكتب ملاحظاتك هنا...", en: "Write your notes here..." },
  loading: { ar: "جاري التحميل...", en: "Loading..." },
  error: { ar: "حدث خطأ", en: "An error occurred" },
  profile: { ar: "الملف الشخصي", en: "Profile" },
  logout: { ar: "تسجيل الخروج", en: "Log Out" },
} as const;

export type LabelKey = keyof typeof labels;

export function l(key: LabelKey, lang: 'ar' | 'en' = 'ar'): string {
  return labels[key][lang];
}

export default labels;
