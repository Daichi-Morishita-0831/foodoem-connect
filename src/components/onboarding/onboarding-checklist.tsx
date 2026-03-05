"use client";

import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

export interface ChecklistItem {
  label: string;
  href: string;
  done: boolean;
}

interface OnboardingChecklistProps {
  items: ChecklistItem[];
}

export function OnboardingChecklist({ items }: OnboardingChecklistProps) {
  const doneCount = items.filter((i) => i.done).length;
  const allDone = doneCount === items.length;

  // 全完了なら非表示
  if (allDone) return null;

  const progress = Math.round((doneCount / items.length) * 100);

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          はじめにやること
        </h3>
        <span className="text-xs text-gray-500">
          {doneCount}/{items.length} 完了
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1.5 rounded-full bg-orange-200">
        <div
          className="h-1.5 rounded-full bg-orange-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="flex items-center gap-2 rounded-lg p-2 text-sm transition hover:bg-orange-100"
            >
              {item.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-gray-400" />
              )}
              <span
                className={
                  item.done ? "text-gray-400 line-through" : "text-gray-700"
                }
              >
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
