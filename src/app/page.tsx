import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { DualCta } from "@/components/landing/dual-cta";
import { UtensilsCrossed } from "lucide-react";
import {
  generateOrganizationLD,
  generateWebSiteLD,
  generateFaqLD,
} from "@/lib/seo/json-ld";

const faqData = [
  {
    question: "利用料金はかかりますか？",
    answer:
      "飲食店様のご利用は完全無料です。工場の検索・問い合わせ・メッセージのやり取りまで、すべて無料でお使いいただけます。",
  },
  {
    question: "どんな食品のOEM製造に対応していますか？",
    answer:
      "調味料、ソース、レトルト食品、冷凍食品、菓子類、ドリンク、健康食品など幅広いカテゴリに対応しています。",
  },
  {
    question: "最小ロットはどのくらいですか？",
    answer:
      "工場によって異なりますが、小ロット対応の工場も多数登録されています。最小50個〜対応可能な工場もあります。",
  },
];

export default function Home() {
  const orgLD = generateOrganizationLD();
  const siteLD = generateWebSiteLD();
  const faqLD = generateFaqLD(faqData);

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([orgLD, siteLD, faqLD]),
        }}
      />
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <TestimonialsSection />
        <FaqSection />
        <DualCta />
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
