import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { Header } from "@/components/layout/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="text-center">
          <FileQuestion className="mx-auto h-16 w-16 text-gray-300" />
          <h1 className="mt-4 text-4xl font-bold text-gray-900">404</h1>
          <h2 className="mt-2 text-lg font-medium text-gray-700">
            ページが見つかりません
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            お探しのページは存在しないか、移動された可能性があります。
          </p>
          <div className="mt-6">
            <Link href="/">
              <Button className="bg-orange-600 hover:bg-orange-700">
                トップに戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
