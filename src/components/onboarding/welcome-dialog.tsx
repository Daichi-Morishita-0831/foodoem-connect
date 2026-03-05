"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, X } from "lucide-react";

interface WelcomeDialogProps {
  userName: string;
  role: "restaurant" | "oem";
}

export function WelcomeDialog({ userName, role }: WelcomeDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const key = `foodoem_welcome_shown_${role}`;
    if (!localStorage.getItem(key)) {
      setOpen(true);
      localStorage.setItem(key, "true");
    }
  }, [role]);

  if (!open) return null;

  const messages =
    role === "restaurant"
      ? {
          title: "FoodOEM Connectへようこそ！",
          body: "音声やテキストで要望を伝えるだけで、最適なOEM工場をAIがマッチングします。まずは案件を作成してみましょう。",
          cta: "案件を作成する",
          href: "/projects/new",
        }
      : {
          title: "FoodOEM Connectへようこそ！",
          body: "プロフィールを充実させると、飲食店からの問い合わせが届きやすくなります。まずはプロフィールを設定しましょう。",
          cta: "プロフィールを設定",
          href: "/oem/profile",
        };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="mx-4 max-w-md">
        <CardContent className="relative p-6">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-orange-100 p-4">
              <Sparkles className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <h2 className="mb-2 text-center text-xl font-bold text-gray-900">
            {messages.title}
          </h2>
          <p className="mb-1 text-center text-sm text-gray-500">
            {userName}さん
          </p>
          <p className="mb-6 text-center text-sm leading-relaxed text-gray-600">
            {messages.body}
          </p>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <a href={messages.href}>{messages.cta}</a>
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              あとで
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
