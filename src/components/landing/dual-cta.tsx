import Link from "next/link";
import { UtensilsCrossed, Factory } from "lucide-react";

export function DualCta() {
  return (
    <section aria-labelledby="cta-heading" className="bg-gradient-to-r from-orange-600 to-amber-600 py-20 text-white">
      <div className="container mx-auto px-4">
        <h2 id="cta-heading" className="mb-4 text-center text-3xl font-bold">
          さあ、始めましょう
        </h2>
        <p className="mb-12 text-center text-orange-100">
          飲食店もOEM工場も、登録は無料です
        </p>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* 飲食店向け */}
          <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
            <div className="mb-4 inline-flex rounded-lg bg-white/20 p-3">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">飲食店の方</h3>
            <p className="mb-6 text-sm text-orange-100">
              オリジナル商品を開発したい飲食店オーナー様へ。
              音声で要望を伝えるだけで、最適な工場が見つかります。
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-orange-700 transition hover:bg-orange-50"
            >
              無料で始める
            </Link>
          </div>

          {/* OEM工場向け */}
          <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
            <div className="mb-4 inline-flex rounded-lg bg-white/20 p-3">
              <Factory className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold">OEM工場の方</h3>
            <p className="mb-6 text-sm text-orange-100">
              新規顧客を獲得したい食品OEM工場様へ。
              プロフィールを登録するだけで案件が届きます。
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg border border-white px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              OEM工場として登録
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
