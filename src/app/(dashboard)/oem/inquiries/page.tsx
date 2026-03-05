import Link from "next/link";
import { getInquiriesForOem } from "@/lib/supabase/queries/inquiries";
import { inquiryStatusLabels, inquiryStatusColors } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OemInquiriesPage() {
  const inquiries = await getInquiriesForOem();

  const pending = inquiries.filter((i) => i.status === "pending");
  const approved = inquiries.filter((i) => i.status === "approved");
  const rejected = inquiries.filter((i) => i.status === "rejected");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">問い合わせ一覧</h1>
        <p className="text-sm text-gray-500">飲食店からの問い合わせを管理</p>
      </div>

      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">まだ問い合わせはありません</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* 保留中 */}
          {pending.length > 0 && (
            <InquirySection title="保留中" inquiries={pending} />
          )}
          {/* 承認済み */}
          {approved.length > 0 && (
            <InquirySection title="承認済み" inquiries={approved} />
          )}
          {/* 辞退 */}
          {rejected.length > 0 && (
            <InquirySection title="辞退" inquiries={rejected} />
          )}
        </div>
      )}
    </div>
  );
}

function InquirySection({
  title,
  inquiries,
}: {
  title: string;
  inquiries: Awaited<ReturnType<typeof getInquiriesForOem>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <Badge variant="secondary">{inquiries.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
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
                  {inquiry.restaurant?.company_name ?? "不明"}
                </p>
                {inquiry.message && (
                  <p className="mt-1 truncate text-sm text-gray-400">
                    {inquiry.message}
                  </p>
                )}
              </div>
              <div className="ml-4 flex flex-col items-end gap-1">
                <Badge
                  className={
                    inquiryStatusColors[inquiry.status] ?? "bg-gray-100 text-gray-700"
                  }
                >
                  {inquiryStatusLabels[inquiry.status] ?? inquiry.status}
                </Badge>
                <span className="text-xs text-gray-400">
                  {new Date(inquiry.created_at).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
