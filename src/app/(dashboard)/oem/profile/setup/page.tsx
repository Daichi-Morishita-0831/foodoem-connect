import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getMyOemProfile } from "@/lib/supabase/queries/oem-profiles";
import { OemOnboardingWizard } from "@/components/onboarding/oem-onboarding-wizard";

export default async function OemProfileSetupPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.profile.role !== "oem") {
    redirect("/login");
  }

  const profile = await getMyOemProfile();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          プロフィール設定
        </h1>
        <p className="text-sm text-gray-500">
          4ステップで工場プロフィールを設定しましょう
        </p>
      </div>

      <OemOnboardingWizard
        currentProfile={
          profile
            ? {
                specialties: profile.specialties ?? [],
                certifications: profile.certifications ?? [],
                delivery_areas: profile.delivery_areas ?? [],
                min_lot_size: profile.min_lot_size,
                max_lot_size: profile.max_lot_size,
                production_area: profile.production_area,
                description: profile.description,
              }
            : undefined
        }
      />
    </div>
  );
}
