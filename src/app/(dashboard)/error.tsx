"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-20">
      <Card className="max-w-md">
        <CardContent className="pt-6 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-orange-500" />
          <h2 className="mt-4 text-lg font-bold text-gray-900">
            エラーが発生しました
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ページの読み込み中にエラーが発生しました。
          </p>
          {error.digest && (
            <p className="mt-1 text-xs text-gray-400">
              エラーコード: {error.digest}
            </p>
          )}
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              onClick={reset}
              className="bg-orange-600 hover:bg-orange-700"
            >
              再読み込み
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
