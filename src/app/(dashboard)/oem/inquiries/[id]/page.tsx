import { redirect } from "next/navigation";
import { getInquiryDetail } from "@/lib/supabase/queries/inquiries";
import { InquiryDetailContent } from "@/components/oem/inquiry-detail";

export default async function OemInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getInquiryDetail(id);

  if (!inquiry) {
    redirect("/oem/inquiries");
  }

  return <InquiryDetailContent inquiry={inquiry} />;
}
