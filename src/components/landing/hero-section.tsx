import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mic, ArrowRight, Factory, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm text-orange-700">
            <Mic className="h-4 w-4" />
            音声AIで簡単マッチング
          </div>
          <h1 id="hero-heading" className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            あなたのメニューを
            <br />
            <span className="text-orange-600">量産できる工場</span>が
            <br />
            見つかります
          </h1>
          <p className="mb-8 text-lg text-gray-600 md:text-xl">
            作りたいメニューを声で伝えるだけ。
            <br />
            AIがあなたの要望にぴったりのOEM工場を見つけます。
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-base px-8"
              >
                無料で工場を探す
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="text-base">
                使い方を見る
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Factory className="h-4 w-4" />
              登録工場 200社以上
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              HACCP対応工場多数
            </div>
          </div>
        </div>
      </div>
      {/* 装飾 */}
      <div aria-hidden="true" className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl" />
      <div aria-hidden="true" className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl" />
    </section>
  );
}
