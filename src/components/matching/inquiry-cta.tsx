"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, Check, Lock, Loader2 } from "lucide-react";

export function InquiryCta({
  factoryName,
  matchScore,
  onInquiry,
}: {
  factoryName: string;
  matchScore: number;
  onInquiry?: (message: string) => Promise<void>;
}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    setSending(true);
    try {
      await onInquiry?.(message);
      setSent(true);
    } catch {
      // エラーハンドリングは親コンポーネントで行う
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
        <Check className="h-4 w-4" />
        問い合わせを送信しました。工場からの回答をお待ちください。
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-orange-600 hover:bg-orange-700">
          <Lock className="mr-2 h-4 w-4" />
          この工場に問い合わせる
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>工場への問い合わせ</DialogTitle>
          <DialogDescription>
            問い合わせ後、工場の詳細情報（社名・連絡先）が開示されます。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg bg-orange-50 p-3 text-sm">
            <p className="font-medium text-orange-700">
              マッチ度 {matchScore}% の工場
            </p>
            <p className="mt-1 text-orange-600">
              問い合わせ送信後、相手の社名・連絡先が表示されます
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              メッセージ（任意）
            </label>
            <Textarea
              placeholder="工場への質問やリクエストがあれば記入してください"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          <Button
            className="w-full bg-orange-600 hover:bg-orange-700"
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="mr-2 h-4 w-4" />
            )}
            問い合わせを送信
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
