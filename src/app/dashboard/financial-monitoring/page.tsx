"use client";

import { WORKSTREAMS } from "@/lib/constants";
import { WorkstreamLayout } from "@/components/shared/workstream-layout";
import { WorkstreamOverviewPanel } from "@/components/workstreams/overview-panel";
import { useAuthStore } from "@/stores/auth-store";
import { useFinancialReports } from "@/lib/api-hooks";
import { formatBudget } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutDashboard, Bot, DollarSign } from "lucide-react";

const ws = WORKSTREAMS.find((w) => w.id === "financial")!;

function FinancialReportsTab() {
  const { language: lang } = useAuthStore();
  const { data } = useFinancialReports();
  const reports = data?.items || [];

  const totalAllocated = reports.reduce((s, r) => s + r.budget_allocated, 0);
  const totalSpent = reports.reduce((s, r) => s + r.actual_cost, 0);
  const totalRevenue = reports.reduce((s, r) => s + r.revenue, 0);
  const netVariance = totalAllocated - totalSpent;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي المخصص", value: totalAllocated, color: "text-blue-600" },
          { label: "إجمالي المنصرف", value: totalSpent, color: "text-red-600" },
          { label: "إجمالي الإيرادات", value: totalRevenue, color: "text-emerald-600" },
          { label: "صافي الفرق", value: netVariance, color: netVariance >= 0 ? "text-emerald-600" : "text-red-600" },
        ].map((stat) => (
          <Card key={stat.label} className="border-gray-100">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-lg font-bold ${stat.color}`}>{formatBudget(stat.value, lang)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-[#1a365d]">
            {lang === "ar" ? "التقارير المالية" : "Financial Reports"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الفعالية</TableHead>
                <TableHead>الفترة</TableHead>
                <TableHead>المخصص</TableHead>
                <TableHead>المنصرف</TableHead>
                <TableHead>الإيرادات</TableHead>
                <TableHead>الانحراف %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.initiative_title_ar || "—"}</TableCell>
                  <TableCell className="text-sm">{report.reporting_period}</TableCell>
                  <TableCell className="text-sm">{formatBudget(report.budget_allocated, lang)}</TableCell>
                  <TableCell className="text-sm">{formatBudget(report.actual_cost, lang)}</TableCell>
                  <TableCell className="text-sm">{formatBudget(report.revenue, lang)}</TableCell>
                  <TableCell className={`text-sm font-medium ${report.variance_percentage >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {report.variance_percentage > 0 ? "+" : ""}{report.variance_percentage.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function FinancialMonitoringPage() {
  return (
    <WorkstreamLayout
      title_ar={ws.name_ar}
      title_en={ws.name_en}
      subtitle_ar="متابعة الميزانيات والصرف والإيرادات لبنود التمويل الرئيسية"
      subtitle_en="Track budgets, disbursements, and revenue for major funding line items"
      color={ws.color}
      workstreamId="financial"
      tabs={[
        { id: "overview", label_ar: "نظرة عامة", label_en: "Overview", icon: LayoutDashboard, content: <WorkstreamOverviewPanel workstreamId="financial" accentColor={ws.color} /> },
        { id: "reports", label_ar: "التقارير المالية", label_en: "Financial Reports", icon: DollarSign, content: <FinancialReportsTab /> },
        { id: "ai-chat", label_ar: "موظفي الذكاء الاصطناعي", label_en: "AI Staff", icon: Bot, content: null },
      ]}
    />
  );
}
