"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { submitReview } from "@/lib/supabase/actions/reviews";
import { Star, Loader2 } from "lucide-react";

interface ReviewFormProps {
  projectId: string;
  revieweeId: string;
  revieweeName: string;
}

export function ReviewForm({
  projectId,
  revieweeId,
  revieweeName,
}: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (rating === 0) {
      setError("評価を選択してください");
      return;
    }

    startTransition(async () => {
      const result = await submitReview({
        project_id: projectId,
        reviewee_id: revieweeId,
        rating,
        comment: comment.trim() || null,
      });

      if ("error" in result) {
        setError(result.error);
      } else {
        router.push(`/projects/${projectId}`);
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{revieweeName} への評価</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Star rating */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">総合評価</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition"
              >
                <Star
                  className={`h-8 w-8 ${
                    value <= (hoveredRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            コメント（任意）
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="品質、対応、納期などについてご感想をお聞かせください"
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isPending || rating === 0}
          className="w-full"
        >
          {isPending ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : null}
          レビューを送信
        </Button>
      </CardContent>
    </Card>
  );
}
