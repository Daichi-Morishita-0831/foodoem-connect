"use client";

import { Receipt } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  created_at: string;
}

export function BillingHistory({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">請求履歴</h2>
        </div>
        <p className="text-sm text-gray-500">請求履歴はまだありません。</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">請求履歴</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="pb-3 text-left font-medium text-gray-500">日付</th>
              <th className="pb-3 text-left font-medium text-gray-500">内容</th>
              <th className="pb-3 text-right font-medium text-gray-500">金額</th>
              <th className="pb-3 text-left font-medium text-gray-500">
                ステータス
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="py-3 text-gray-600">
                  {new Date(payment.created_at).toLocaleDateString("ja-JP")}
                </td>
                <td className="py-3 text-gray-900">
                  {payment.description || "サブスクリプション"}
                </td>
                <td className="py-3 text-right font-medium text-gray-900">
                  ¥{payment.amount.toLocaleString()}
                </td>
                <td className="py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      payment.status === "succeeded"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {payment.status === "succeeded" ? "完了" : payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
