import { getAllProjects } from "@/lib/supabase/queries/admin";
import { projectStatusLabels, projectStatusColors } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">案件管理</h1>
        <p className="text-sm text-gray-500">全{projects.length}案件</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/80">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">案件名</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">飲食店</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">作成日</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {proj.title}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {proj.restaurant?.company_name ?? "不明"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          projectStatusColors[proj.status] ??
                          "bg-gray-100 text-gray-700"
                        }
                      >
                        {projectStatusLabels[proj.status] ?? proj.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(proj.created_at).toLocaleDateString("ja-JP")}
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      案件がありません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
