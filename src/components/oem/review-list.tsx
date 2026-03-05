import { Star } from "lucide-react";
import type { Review } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating
              ? "fill-orange-400 text-orange-400"
              : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "今日";
  if (days < 7) return `${days}日前`;
  if (days < 30) return `${Math.floor(days / 7)}週間前`;
  if (days < 365) return `${Math.floor(days / 30)}ヶ月前`;
  return `${Math.floor(days / 365)}年前`;
}

export function ReviewList({
  reviews,
}: {
  reviews: (Review & { reviewerCompanyName: string })[];
}) {
  if (reviews.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        まだレビューはありません
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Stars rating={review.rating} />
              <span className="text-sm font-medium text-gray-700">
                {review.reviewerCompanyName}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {timeAgo(review.created_at)}
            </span>
          </div>
          {review.comment && (
            <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
