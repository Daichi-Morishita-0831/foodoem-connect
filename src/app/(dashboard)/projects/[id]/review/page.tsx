import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getProject } from "@/lib/supabase/queries/projects";
import { ReviewForm } from "@/components/project/review-form";
import { Button } from "@/components/ui/button";

export default async function ProjectReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [currentUser, project] = await Promise.all([
    getCurrentUser(),
    getProject(id),
  ]);

  if (!currentUser) redirect("/login");
  if (!project) redirect("/projects");

  // OEMが割り当てられていない場合はレビュー不可
  if (!project.oem_id) {
    redirect(`/projects/${id}`);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            戻る
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">レビュー</h1>
          <p className="text-sm text-gray-500">{project.title}</p>
        </div>
      </div>

      <ReviewForm
        projectId={id}
        revieweeId={project.oem_id}
        revieweeName="OEM工場"
      />
    </div>
  );
}
