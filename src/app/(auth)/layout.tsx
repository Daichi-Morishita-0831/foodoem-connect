import { UtensilsCrossed } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
            <UtensilsCrossed className="h-6 w-6 text-orange-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            FoodOEM <span className="text-orange-600">Connect</span>
          </h1>
          <p className="text-sm text-gray-500">
            飲食店とOEM工場をつなぐマッチングプラットフォーム
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
