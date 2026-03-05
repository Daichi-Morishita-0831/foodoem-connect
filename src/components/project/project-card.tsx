import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStatusBadge } from "./project-status-badge";
import { ArrowRight, Calendar } from "lucide-react";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  const date = new Date(project.created_at).toLocaleDateString("ja-JP");

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-base">{project.title}</CardTitle>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              {date}
            </div>
          </div>
          <ProjectStatusBadge status={project.status} />
        </CardHeader>
        <CardContent className="flex items-center justify-end">
          <span className="flex items-center gap-1 text-sm text-orange-600">
            詳細を見る
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
