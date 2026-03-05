import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getUserDetail } from "@/lib/supabase/queries/admin";
import { roleLabels, projectStatusLabels, projectStatusColors } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserDetail(id);

  if (!user) {
    redirect("/admin/users");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            戻る
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.company_name}
          </h1>
          <div className="flex gap-2">
            <Badge variant="secondary">{roleLabels[user.role]}</Badge>
            <Badge
              className={
                user.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            >
              {user.is_active ? "有効" : "無効"}
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>プロフィール</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">担当者名</p>
            <p className="font-medium">{user.representative_name ?? "未設定"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">電話番号</p>
            <p className="font-medium">{user.phone ?? "未設定"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">住所</p>
            <p className="font-medium">{user.address ?? "未設定"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">登録日</p>
            <p className="font-medium">
              {new Date(user.created_at).toLocaleDateString("ja-JP")}
            </p>
          </div>
        </CardContent>
      </Card>

      {user.projects && user.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>関連案件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <p className="font-medium text-gray-900">{proj.title}</p>
                  <Badge
                    className={
                      projectStatusColors[proj.status] ??
                      "bg-gray-100 text-gray-700"
                    }
                  >
                    {projectStatusLabels[proj.status] ?? proj.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
