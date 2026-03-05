"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-orange-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          エラーが発生しました
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          予期しないエラーが発生しました。もう一度お試しください。
        </p>
        {error.digest && (
          <p className="mt-1 text-xs text-gray-400">
            エラーコード: {error.digest}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset} className="bg-orange-600 hover:bg-orange-700">
            もう一度試す
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            トップに戻る
          </Button>
        </div>
      </div>
    </div>
  );
}
