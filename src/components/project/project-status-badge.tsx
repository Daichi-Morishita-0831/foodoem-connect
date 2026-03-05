import { Badge } from "@/components/ui/badge";
import {
  projectStatusLabels,
  projectStatusColors,
} from "@/lib/constants";

export function ProjectStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="secondary"
      className={projectStatusColors[status] || "bg-gray-100 text-gray-700"}
    >
      {projectStatusLabels[status] || status}
    </Badge>
  );
}
