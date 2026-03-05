import { redirect } from "next/navigation";
import { getMyOemProfile } from "@/lib/supabase/queries/oem-profiles";
import { OemProfileForm } from "@/components/oem/oem-profile-form";

export default async function OemProfilePage() {
  const profile = await getMyOemProfile();

  if (!profile) {
    redirect("/oem/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">プロフィール編集</h1>
        <p className="text-sm text-gray-500">工場情報を管理して、マッチング精度を高めましょう</p>
      </div>
      <OemProfileForm profile={profile} />
    </div>
  );
}
