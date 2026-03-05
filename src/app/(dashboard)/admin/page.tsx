import { Users, FolderOpen, GitCompare, ClipboardList } from "lucide-react";
import { getAdminStats } from "@/lib/supabase/queries/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const statCards = [
    { label: "総ユーザー数", value: stats.totalUsers, icon: Users, color: "text-blue-600" },
    { label: "総案件数", value: stats.totalProjects, icon: FolderOpen, color: "text-green-600" },
    { label: "総マッチ数", value: stats.totalMatches, icon: GitCompare, color: "text-purple-600" },
    { label: "総問い合わせ数", value: stats.totalInquiries, icon: ClipboardList, color: "text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">管理者ダッシュボード</h1>
        <p className="text-sm text-gray-500">プラットフォーム全体の概要</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {card.label}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${card.color}`}>
                {card.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
