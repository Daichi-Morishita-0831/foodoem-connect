import { Header } from "@/components/layout/header";
import { UtensilsCrossed } from "lucide-react";

export default function PublicOemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-8">{children}</main>
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-bold text-gray-900">
              FoodOEM Connect
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            &copy; 2026 FoodOEM Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
