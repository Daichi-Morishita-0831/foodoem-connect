import { Star } from "lucide-react";

const testimonials = [
  {
    name: "田中 健太",
    role: "イタリアンレストラン オーナー",
    rating: 5,
    comment:
      "自家製パスタソースのOEM化を検討していましたが、どこに頼めばいいか分からず困っていました。音声で要望を伝えるだけで3社の候補が出てきて、1週間で商談が始まりました。",
  },
  {
    name: "佐藤 美咲",
    role: "和食料理店 店長",
    rating: 5,
    comment:
      "だし調味料のOEM製造をお願いしました。AIが仕様書を自動作成してくれるので、工場とのやり取りがスムーズ。品質にも大満足です。",
  },
  {
    name: "鈴木 大輔",
    role: "カフェチェーン 商品開発担当",
    rating: 4,
    comment:
      "オリジナルグラノーラの開発で利用。複数工場を比較検討できるのが良い。メッセージ機能で細かい調整もスピーディーにできました。",
  },
];

export function TestimonialsSection() {
  return (
    <section aria-labelledby="testimonials-heading" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 id="testimonials-heading" className="mb-3 text-3xl font-bold text-gray-900">
            お客様の声
          </h2>
          <p className="text-gray-500">
            FoodOEM Connectを活用した飲食店様の声をご紹介
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < t.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                {t.comment}
              </p>
              <div className="border-t pt-4">
                <p className="font-medium text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
