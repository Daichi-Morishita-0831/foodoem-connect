"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "利用料金はかかりますか？",
    a: "飲食店様のご利用は完全無料です。工場の検索・問い合わせ・メッセージのやり取りまで、すべて無料でお使いいただけます。",
  },
  {
    q: "どんな食品のOEM製造に対応していますか？",
    a: "調味料、ソース、レトルト食品、冷凍食品、菓子類、ドリンク、健康食品など幅広いカテゴリに対応しています。登録工場の得意分野から最適な工場をAIがマッチングします。",
  },
  {
    q: "最小ロットはどのくらいですか？",
    a: "工場によって異なりますが、小ロット対応の工場も多数登録されています。最小50個〜対応可能な工場もあります。",
  },
  {
    q: "問い合わせ前に工場の情報は見られますか？",
    a: "マッチング結果では工場の得意分野・認証・対応ロット範囲などを匿名で確認できます。問い合わせ承認後に詳細情報が開示される安心設計です。",
  },
  {
    q: "レシピ仕様書は自分で作る必要がありますか？",
    a: "いいえ。音声またはテキストで要望を伝えるだけで、AIが自動的にレシピ仕様書を作成します。もちろん手動で編集することも可能です。",
  },
  {
    q: "OEM工場として登録するにはどうすればいいですか？",
    a: "「OEM工場として登録」ボタンから無料で登録できます。得意分野・認証・対応エリアなどのプロフィールを設定すると、飲食店からの問い合わせを受けられるようになります。",
  },
];

export function FaqSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900">
            よくある質問
          </h2>
          <p className="text-gray-500">
            ご不明な点はお気軽にお問い合わせください
          </p>
        </div>
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-gray-600">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
