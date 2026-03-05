import {
  Mic,
  Brain,
  Factory,
  Shield,
  MessageSquare,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "音声でかんたん入力",
    description:
      "作りたいメニューを話すだけ。AIが自動でレシピ仕様書を作成します。",
  },
  {
    icon: Brain,
    title: "AIマッチング",
    description:
      "得意分野・認証・ロット・エリアなど多角的に分析し、最適な工場を提案。",
  },
  {
    icon: Factory,
    title: "厳選されたOEM工場",
    description:
      "食品衛生・品質管理の基準をクリアした信頼できる工場のみ掲載。",
  },
  {
    icon: Shield,
    title: "安心の段階開示",
    description:
      "問い合わせ前は匿名。承認後に初めて工場情報が開示される安全設計。",
  },
  {
    icon: MessageSquare,
    title: "リアルタイムメッセージ",
    description:
      "工場との商談をプラットフォーム内で完結。履歴も自動保存されます。",
  },
  {
    icon: BarChart3,
    title: "進捗を一目で管理",
    description:
      "案件ステータス・見積もり・納期をダッシュボードで一元管理。",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900">
            選ばれる理由
          </h2>
          <p className="text-gray-500">
            FoodOEM Connectが飲食店のOEM開発を変えます
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-gray-100 bg-white p-6 transition hover:border-orange-200 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-lg bg-orange-50 p-3 text-orange-600 transition group-hover:bg-orange-100">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
