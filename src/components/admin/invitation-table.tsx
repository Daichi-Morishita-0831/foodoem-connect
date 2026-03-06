"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cancelInvitation, resendInvitation } from "@/lib/actions/invitations";
import { RotateCw, X } from "lucide-react";

interface Invitation {
  id: string;
  email: string;
  company_name: string;
  status: string;
  expires_at: string;
  created_at: string;
  accepted_at: string | null;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "招待中", variant: "default" },
  accepted: { label: "承認済", variant: "secondary" },
  expired: { label: "期限切れ", variant: "outline" },
  cancelled: { label: "キャンセル", variant: "destructive" },
};

export function InvitationTable({ invitations }: { invitations: Invitation[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  async function handleCancel(id: string) {
    setLoadingId(id);
    await cancelInvitation(id);
    setLoadingId(null);
  }

  async function handleResend(id: string) {
    setLoadingId(id);
    await resendInvitation(id);
    setLoadingId(null);
  }

  if (invitations.length === 0) {
    return (
      <p className="text-sm text-gray-500">まだ招待がありません。</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500">会社名</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">メール</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">送信日</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">期限</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {invitations.map((inv) => {
            const status = inv.status === "pending" && isExpired(inv.expires_at) ? "expired" : inv.status;
            const config = statusConfig[status] ?? statusConfig.pending;

            return (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {inv.company_name}
                </td>
                <td className="px-4 py-3 text-gray-600">{inv.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={config.variant}>{config.label}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(inv.created_at).toLocaleDateString("ja-JP")}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(inv.expires_at).toLocaleDateString("ja-JP")}
                </td>
                <td className="px-4 py-3">
                  {status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResend(inv.id)}
                        disabled={loadingId === inv.id}
                      >
                        <RotateCw className="mr-1 h-3 w-3" />
                        再送
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCancel(inv.id)}
                        disabled={loadingId === inv.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="mr-1 h-3 w-3" />
                        取消
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
