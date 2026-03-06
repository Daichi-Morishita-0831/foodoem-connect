"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createInvitation } from "@/lib/actions/invitations";
import { Send } from "lucide-react";

export function InvitationForm() {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage(null);

    const result = await createInvitation(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "招待メールを送信しました" });
    }

    setIsPending(false);
  }

  return (
    <form action={handleSubmit} className="rounded-lg border bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        新規招待
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="companyName">会社名 *</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="株式会社〇〇食品"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">メールアドレス *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="info@example.com"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="message">メッセージ（任意）</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="招待メールに添えるメッセージを入力..."
          rows={3}
        />
      </div>

      {message && (
        <div
          className={`mt-4 rounded-md p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={isPending} className="mt-4 bg-orange-600 hover:bg-orange-700">
        <Send className="mr-2 h-4 w-4" />
        {isPending ? "送信中..." : "招待メールを送信"}
      </Button>
    </form>
  );
}
