import type { ProjectEvent } from "@/types";
import { projectStatusLabels } from "@/lib/constants";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;
  if (days < 30) return `${Math.floor(days / 7)}週間前`;
  return `${Math.floor(days / 30)}ヶ月前`;
}

const eventConfig: Record<
  string,
  { color: string; label: (e: ProjectEvent) => string }
> = {
  status_change: {
    color: "bg-green-500",
    label: (e) => {
      const newLabel =
        projectStatusLabels[e.new_value as keyof typeof projectStatusLabels] ??
        e.new_value;
      return `ステータスが「${newLabel}」に変更されました`;
    },
  },
  inquiry_sent: {
    color: "bg-orange-500",
    label: () => "問い合わせが送信されました",
  },
  inquiry_responded: {
    color: "bg-blue-500",
    label: (e) =>
      e.new_value === "approved"
        ? "問い合わせが承認されました"
        : "問い合わせが辞退されました",
  },
  message_sent: {
    color: "bg-indigo-400",
    label: () => "メッセージが送信されました",
  },
  file_uploaded: {
    color: "bg-purple-400",
    label: () => "ファイルがアップロードされました",
  },
  review_submitted: {
    color: "bg-yellow-500",
    label: () => "レビューが投稿されました",
  },
};

export function ProjectTimeline({ events }: { events: ProjectEvent[] }) {
  if (events.length === 0) return null;

  return (
    <div className="space-y-0">
      {events.map((event, i) => {
        const config = eventConfig[event.event_type] ?? {
          color: "bg-gray-400",
          label: () => event.event_type,
        };
        const actorName =
          (event.actor as unknown as { company_name?: string })
            ?.company_name ?? "";

        return (
          <div key={event.id} className="flex gap-3">
            {/* 線 + ドット */}
            <div className="flex flex-col items-center">
              <div
                className={`h-3 w-3 shrink-0 rounded-full ${config.color}`}
              />
              {i < events.length - 1 && (
                <div className="w-px flex-1 bg-gray-200" />
              )}
            </div>
            {/* テキスト */}
            <div className="pb-6">
              <p className="text-sm text-gray-700">{config.label(event)}</p>
              <p className="mt-0.5 text-xs text-gray-400">
                {actorName && `${actorName} · `}
                {timeAgo(event.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
