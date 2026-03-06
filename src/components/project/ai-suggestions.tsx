"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

interface SpecSuggestion {
  field: string;
  fieldLabel: string;
  suggestion: string;
  reason: string;
}

export function AiSuggestions({ specId }: { specId: string }) {
  const [suggestions, setSuggestions] = useState<SpecSuggestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function fetchSuggestions() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specId }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setExpanded(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          <h3 className="font-semibold text-amber-900">AI仕様提案</h3>
        </div>
        {suggestions === null ? (
          <Button
            size="sm"
            variant="outline"
            onClick={fetchSuggestions}
            disabled={loading}
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                分析中...
              </>
            ) : (
              "提案を見る"
            )}
          </Button>
        ) : (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-amber-600 hover:text-amber-800"
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {suggestions !== null && expanded && (
        <div className="mt-4 space-y-3">
          {suggestions.length === 0 ? (
            <p className="text-sm text-amber-700">
              現在の仕様は十分詳細です。追加提案はありません。
            </p>
          ) : (
            suggestions.map((s, i) => (
              <div
                key={i}
                className="rounded-md bg-white p-3 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                    {s.fieldLabel}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {s.suggestion}
                </p>
                <p className="mt-1 text-xs text-gray-500">{s.reason}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
