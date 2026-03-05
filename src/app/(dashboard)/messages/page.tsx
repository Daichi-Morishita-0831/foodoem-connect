import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { getConversationList } from "@/lib/supabase/queries/messages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MessagesPage() {
  const conversations = await getConversationList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">メッセージ</h1>
        <p className="text-sm text-gray-500">案件ごとのやり取り</p>
      </div>

      {conversations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-gray-500">まだメッセージはありません</p>
            <p className="mt-1 text-sm text-gray-400">
              問い合わせが承認されるとメッセージを送信できます
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <Link
              key={conv.project.id}
              href={`/messages/${conv.project.id}`}
              className="block rounded-lg border bg-white p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">
                    {conv.project.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {conv.otherUser?.company_name ?? "相手未定"}
                  </p>
                  {conv.lastMessage ? (
                    <p className="mt-1 truncate text-sm text-gray-400">
                      {conv.lastMessage.content}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-300">
                      メッセージなし
                    </p>
                  )}
                </div>
                {conv.lastMessage && (
                  <span className="ml-4 shrink-0 text-xs text-gray-400">
                    {new Date(conv.lastMessage.created_at).toLocaleDateString(
                      "ja-JP"
                    )}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
