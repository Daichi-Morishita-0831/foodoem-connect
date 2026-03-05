"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useRealtimeMessages } from "@/hooks/use-realtime-messages";
import { sendMessage } from "@/lib/supabase/actions/messages";
import type { Message } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
  });
}

export function ChatView({
  projectId,
  projectTitle,
  currentUserId,
  initialMessages,
}: {
  projectId: string;
  projectTitle: string;
  currentUserId: string;
  initialMessages: Message[];
}) {
  const messages = useRealtimeMessages(projectId, initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 新規メッセージで自動スクロール
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setSending(true);
    await sendMessage(projectId, text);
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 日付ごとにグループ化
  let lastDate = "";

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 border-b pb-4">
        <Link href="/messages">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{projectTitle}</h1>
        </div>
      </div>

      {/* メッセージエリア */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-400">
              メッセージを送信してやり取りを始めましょう
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const msgDate = formatDate(msg.created_at);
              const showDate = msgDate !== lastDate;
              lastDate = msgDate;
              const isOwn = msg.sender_id === currentUserId;

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="my-4 text-center">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                        {msgDate}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "rounded-br-md bg-orange-500 text-white"
                          : "rounded-bl-md bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">
                        {msg.content}
                      </p>
                      <p
                        className={`mt-1 text-right text-[10px] ${
                          isOwn ? "text-orange-200" : "text-gray-400"
                        }`}
                      >
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 入力エリア */}
      <div className="border-t pt-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力..."
            disabled={sending}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
