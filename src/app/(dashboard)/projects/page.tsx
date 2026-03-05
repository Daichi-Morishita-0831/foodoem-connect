import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project/project-card";
import { mockProjects } from "@/lib/mock/projects";
import { Mic, Plus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">案件一覧</h1>
          <p className="mt-1 text-sm text-gray-500">
            OEM依頼案件の管理・進捗確認
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Mic className="mr-2 h-4 w-4" />
            新規依頼
          </Button>
        </Link>
      </div>

      {mockProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-16">
          <Plus className="mb-4 h-12 w-12 text-gray-300" />
          <p className="mb-4 text-gray-500">まだ案件がありません</p>
          <Link href="/projects/new">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Mic className="mr-2 h-4 w-4" />
              最初の依頼を作成
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
