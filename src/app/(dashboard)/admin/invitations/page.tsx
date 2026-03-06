import { createClient } from "@/lib/supabase/server";
import { InvitationForm } from "@/components/admin/invitation-form";
import { InvitationTable } from "@/components/admin/invitation-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OEM工場招待",
};

export default async function InvitationsPage() {
  const supabase = await createClient();

  const { data: invitations } = await supabase
    .from("oem_invitations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">OEM工場招待</h1>
        <p className="mt-1 text-sm text-gray-500">
          OEM工場をFoodOEM Connectに招待します
        </p>
      </div>

      <InvitationForm />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          招待一覧
        </h2>
        <InvitationTable invitations={invitations ?? []} />
      </div>
    </div>
  );
}
