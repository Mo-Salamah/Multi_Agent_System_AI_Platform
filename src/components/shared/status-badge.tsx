import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS, INITIATIVE_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusDef = INITIATIVE_STATUSES.find((s) => s.value === status);
  const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-700";

  return (
    <Badge variant="outline" className={cn("font-medium border", colorClass, className)}>
      {statusDef?.label_ar || status}
    </Badge>
  );
}
