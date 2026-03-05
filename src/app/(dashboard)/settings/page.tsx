import { getCurrentUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="text-sm text-gray-500">アカウント設定</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>プロフィール</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-gray-500">会社名</p>
            <p className="font-medium">{currentUser.profile.company_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">メールアドレス</p>
            <p className="font-medium">{currentUser.authUser.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">ロール</p>
            <p className="font-medium">
              {currentUser.profile.role === "restaurant"
                ? "飲食店"
                : currentUser.profile.role === "oem"
                ? "OEM工場"
                : "管理者"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
