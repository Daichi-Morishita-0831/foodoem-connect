import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-orange-600 to-amber-600 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              今すぐ、あなたの理想の工場を見つけましょう
            </h2>
            <p className="mb-8 text-orange-100">
              登録は無料。音声で要望を伝えるだけで始められます。
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              無料で始める
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-orange-600" />
              <span className="font-bold text-gray-900">
                FoodOEM Connect
              </span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; 2026 FoodOEM Connect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
