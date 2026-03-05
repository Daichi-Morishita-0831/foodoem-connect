import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <FileQuestion className="mx-auto h-12 w-12 text-gray-300" />
        <h2 className="mt-4 text-lg font-bold text-gray-900">
          ページが見つかりません
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <div className="mt-6">
          <Link href="/projects">
            <Button variant="outline">ダッシュボードに戻る</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
