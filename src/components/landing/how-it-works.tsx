import { Mic, Brain, Factory, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: Mic,
    title: "声で要望を伝える",
    description:
      "作りたいメニュー、原価感、ロット数を音声で伝えるだけ。フォーム入力は不要です。",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Brain,
    title: "AIが仕様書を作成",
    description:
      "AIがあなたの要望を製造工場が理解できる仕様書に自動変換。食材・工程・包装まで構造化。",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Factory,
    title: "最適な工場をマッチング",
    description:
      "認証・ロット・得意分野からAIが最適な工場を選出。マッチ度付きで提案します。",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: MessageSquare,
    title: "工場と直接やりとり",
    description:
      "気になる工場に問い合わせ。仕様書をベースに、スムーズに商談を進められます。",
    color: "bg-purple-100 text-purple-600",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            4ステップで簡単マッチング
          </h2>
          <p className="text-gray-600">
            忙しい飲食店オーナーのために、とことんシンプルに。
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-0.5 w-full translate-x-1/2 bg-gray-200 lg:block" />
              )}
              <div
                className={`relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${step.color}`}
              >
                <step.icon className="h-7 w-7" />
              </div>
              <div className="mb-2 text-sm font-medium text-orange-600">
                STEP {index + 1}
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
