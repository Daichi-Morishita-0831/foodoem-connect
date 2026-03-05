import { cn } from "@/lib/utils";

export function MatchScoreBadge({ score }: { score: number }) {
  const colorClass =
    score >= 90
      ? "bg-green-100 text-green-700 border-green-200"
      : score >= 75
        ? "bg-blue-100 text-blue-700 border-blue-200"
        : "bg-amber-100 text-amber-700 border-amber-200";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-bold",
        colorClass
      )}
    >
      <span className="text-lg">{score}</span>
      <span className="text-xs font-normal">% マッチ</span>
    </div>
  );
}
