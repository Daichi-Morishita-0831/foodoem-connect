import { getCurrentUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { getLineStatus } from "@/lib/actions/line";
import { LineLinkCard } from "@/components/settings/line-link-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LINE連携",
};

export default async function LineSettingsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const lineStatus = await getLineStatus();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">LINE連携</h1>
        <p className="mt-1 text-sm text-gray-500">
          LINEアカウントを連携して、通知やログインを便利にしましょう。
        </p>
      </div>

      <LineLinkCard lineStatus={lineStatus} />
    </div>
  );
}
