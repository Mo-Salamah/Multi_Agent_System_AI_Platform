// Entity types
export type EntityType = 'secretariat' | 'planning_oversight' | 'execution' | 'leadership';
export type UserRole = 'super_admin' | 'secretariat_admin' | 'secretariat_user' | 'planning_admin' | 'planning_user' | 'execution_admin' | 'execution_user' | 'leadership' | 'viewer';

export interface Entity {
  id: string;
  name: string;
  name_ar: string;
  entity_type: EntityType;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  full_name_ar: string;
  entity_id: string;
  entity?: Entity;
  entity_name?: string;
  entity_name_ar?: string;
  role: UserRole;
  language_preference: 'ar' | 'en';
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

// Planning
export interface PlanningCycle {
  id: string;
  name: string;
  name_ar: string;
  year_start: number;
  year_end: number;
  submission_deadline: string;
  status: 'open' | 'closed';
  created_at: string;
}

// Initiative
export type InitiativeType = 'cultural' | 'sports' | 'entertainment' | 'economic' | 'social';
export type FundingType = 'government' | 'private' | 'mixed';
export type InitiativeStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'revision_requested';

export interface Initiative {
  id: string;
  cycle_id: string;
  entity_id: string;
  submitted_by: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  initiative_type: InitiativeType;
  funding_type: FundingType;
  start_date: string;
  end_date: string;
  city: string;
  city_ar: string;
  venue: string;
  venue_ar: string;
  estimated_budget: number;
  currency: string;
  cashflow_plan: Record<string, number> | null;
  is_funded?: boolean;
  tier?: string | null;
  event_type_ar?: string | null;
  organizer?: string | null;
  organizer_ar?: string | null;
  addition_status?: string | null;
  funding_status?: string | null;
  inclusion_status?: string | null;
  status: InitiativeStatus;
  status_history: StatusHistoryEntry[];
  additional_data: Record<string, string> | null;
  tags: string[];
  attachments: Attachment[];
  refined_description: string | null;
  refined_description_ar: string | null;
  ai_refinement_metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface StatusHistoryEntry {
  status: InitiativeStatus;
  /** API returns 'at' field (legacy 'changed_at' also supported) */
  at?: string;
  changed_at?: string;
  changed_by?: string;
  comment?: string;
}

export interface Attachment {
  file_id: string;
  filename: string;
  uploaded_at: string;
}

// Financial
export type ReportStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface FinancialReport {
  id: string;
  initiative_id: string;
  initiative_title?: string;
  initiative_title_ar?: string;
  initiative?: Initiative;
  entity_id: string;
  reporting_period: string;
  report_type: string;
  budget_allocated: number;
  actual_cost: number;
  revenue: number;
  variance: number;
  variance_percentage: number;
  cashflow_actual: Record<string, number> | null;
  disbursement_data: Record<string, unknown> | null;
  notes: string;
  notes_ar: string;
  attachments: Attachment[];
  status: ReportStatus;
  ai_analysis: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Performance
export interface PerformanceRecord {
  id: string;
  initiative_id: string;
  initiative?: Initiative;
  entity_id: string;
  attendance_actual: number;
  attendance_target: number;
  satisfaction_score: number;
  kpi_data: Record<string, unknown> | null;
  highlights: string;
  highlights_ar: string;
  challenges: string;
  challenges_ar: string;
  attachments: Attachment[];
  status: ReportStatus;
  ai_analysis: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Approvals
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested';
export type ApprovalItemType = 'initiative' | 'financial' | 'performance';

export interface ApprovalRequest {
  id: string;
  item_type: ApprovalItemType;
  item_id: string;
  requested_by: string;
  assigned_to: string;
  entity_id: string;
  status: ApprovalStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  comments: string;
  comments_ar: string;
  decision_reason: string | null;
  ai_context: Record<string, unknown> | null;
  due_date: string | null;
  decided_at: string | null;
  decided_by: string | null;
  created_at: string;
}

// AI Jobs
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AIJob {
  id: string;
  job_type: string;
  input_data: Record<string, unknown>;
  status: JobStatus;
  result: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

// Dashboard analytics
export interface DashboardData {
  total_initiatives: number;
  total_budget: number;
  pending_approvals: number;
  avg_satisfaction: number;
  initiatives_by_type: Record<string, number>;
  initiatives_by_city: Record<string, number>;
  initiatives_by_status: Record<string, number>;
  initiatives_by_month: Record<string, number>;
  recent_activity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'initiative_created' | 'status_changed' | 'approval_decided' | 'report_submitted';
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  timestamp: string;
}

// API response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}
