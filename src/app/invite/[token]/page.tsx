import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { UtensilsCrossed, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OEM工場招待",
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: invitation } = await supabase
    .from("oem_invitations")
    .select("*")
    .eq("token", token)
    .single();

  if (!invitation) {
    notFound();
  }

  const isExpired = new Date(invitation.expires_at) < new Date();
  const isAccepted = invitation.status === "accepted";
  const isCancelled = invitation.status === "cancelled";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-orange-600" />
          <span className="text-xl font-bold text-gray-900">
            FoodOEM <span className="text-orange-600">Connect</span>
          </span>
        </div>

        {isAccepted ? (
          <div className="text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h1 className="mb-2 text-xl font-bold text-gray-900">
              登録済みです
            </h1>
            <p className="mb-6 text-sm text-gray-600">
              この招待は既に使用されています。ログインしてください。
            </p>
            <Link href="/login">
              <Button className="bg-orange-600 hover:bg-orange-700">
                ログインする
              </Button>
            </Link>
          </div>
        ) : isExpired || isCancelled ? (
          <div className="text-center">
            <XCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
            <h1 className="mb-2 text-xl font-bold text-gray-900">
              {isCancelled ? "招待がキャンセルされました" : "招待の有効期限が切れました"}
            </h1>
            <p className="mb-6 text-sm text-gray-600">
              新しい招待を管理者にリクエストしてください。
            </p>
            <Link href="/">
              <Button variant="outline">トップに戻る</Button>
            </Link>
          </div>
        ) : (
          <div>
            <h1 className="mb-2 text-xl font-bold text-gray-900">
              OEM工場登録のご招待
            </h1>
            <p className="mb-6 text-sm text-gray-600">
              <span className="font-medium text-gray-900">
                {invitation.company_name}
              </span>
              様宛ての招待です。アカウントを作成してFoodOEM Connectに参加しましょう。
            </p>

            {invitation.message && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <p className="mb-1 text-xs font-medium text-gray-500">
                  担当者からのメッセージ
                </p>
                <p className="text-sm text-gray-700">{invitation.message}</p>
              </div>
            )}

            <div className="mb-6 rounded-lg bg-orange-50 p-4">
              <p className="mb-2 text-sm font-medium text-orange-800">
                登録のメリット
              </p>
              <ul className="space-y-1 text-sm text-orange-700">
                <li>- 飲食店からの案件が自動で届く</li>
                <li>- 得意分野に合ったマッチング</li>
                <li>- プラットフォーム利用料は無料</li>
              </ul>
            </div>

            <Link href={`/register?invite=${token}`}>
              <Button className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                アカウントを作成する
              </Button>
            </Link>

            <p className="mt-4 text-center text-xs text-gray-400">
              既にアカウントをお持ちの方は
              <Link href="/login" className="text-orange-600 hover:underline">
                ログイン
              </Link>
              してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
