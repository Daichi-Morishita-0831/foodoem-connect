import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { DualCta } from "@/components/landing/dual-cta";
import { UtensilsCrossed } from "lucide-react";
import { generateOrganizationLD, generateWebSiteLD } from "@/lib/seo/json-ld";

export default function Home() {
  const orgLD = generateOrganizationLD();
  const siteLD = generateWebSiteLD();

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([orgLD, siteLD]) }}
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
