import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProject } from "@/lib/supabase/queries/projects";
import { getMatchResults } from "@/lib/supabase/queries/matches";
import { MatchesContent } from "@/components/matching/matches-content";

export default async function MatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const matchResults = await getMatchResults(id);

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/projects/${id}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          案件詳細に戻る
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">マッチング結果</h1>
        <p className="mt-1 text-sm text-gray-500">
          「{project.title}」の製造に対応できる工場
        </p>
      </div>

      <MatchesContent matches={matchResults} />
    </div>
  );
}
