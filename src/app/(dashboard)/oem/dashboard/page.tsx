import Link from "next/link";
import { ClipboardList, FolderOpen, TrendingUp } from "lucide-react";
import { getInquiriesForOem, getOemInquiryStats } from "@/lib/supabase/queries/inquiries";
import { getMyOemProfile } from "@/lib/supabase/queries/oem-profiles";
import { inquiryStatusLabels, inquiryStatusColors } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  OnboardingChecklist,
  type ChecklistItem,
} from "@/components/onboarding/onboarding-checklist";

export default async function OemDashboardPage() {
  const [stats, inquiries, profile] = await Promise.all([
    getOemInquiryStats(),
    getInquiriesForOem(),
    getMyOemProfile(),
  ]);

  const checklistItems: ChecklistItem[] = [
    {
      label: "得意分野を設定する",
      href: "/oem/profile",
      done: (profile?.specialties?.length ?? 0) > 0,
    },
    {
      label: "認証・資格を登録する",
      href: "/oem/profile",
      done: (profile?.certifications?.length ?? 0) > 0,
    },
    {
      label: "配送エリアを設定する",
      href: "/oem/profile",
      done: (profile?.delivery_areas?.length ?? 0) > 0,
    },
    {
      label: "問い合わせに回答する",
      href: "/oem/inquiries",
      done: stats.approved > 0,
    },
  ];

  const recentInquiries = inquiries.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-sm text-gray-500">工場への問い合わせ状況</p>
      </div>

      <OnboardingChecklist items={checklistItems} />

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              保留中の問い合わせ
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              承認済み案件
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              総問い合わせ数
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>
      </div>

      {/* 最新の問い合わせ */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>最新の問い合わせ</CardTitle>
          <Link href="/oem/inquiries">
            <Button variant="outline" size="sm">
              すべて表示
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentInquiries.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              まだ問い合わせはありません
            </p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href={`/oem/inquiries/${inquiry.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">
                      {inquiry.project?.title ?? "案件名不明"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {inquiry.restaurant?.company_name ?? "不明"} ・{" "}
                      {new Date(inquiry.created_at).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                  <Badge
                    className={
                      inquiryStatusColors[inquiry.status] ?? "bg-gray-100 text-gray-700"
                    }
                  >
                    {inquiryStatusLabels[inquiry.status] ?? inquiry.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
