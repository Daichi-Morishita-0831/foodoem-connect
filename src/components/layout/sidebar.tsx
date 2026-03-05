"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  Mic,
  MessageSquare,
  Settings,
  UtensilsCrossed,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "ダッシュボード",
    href: "/projects",
    icon: LayoutDashboard,
  },
  {
    label: "新規依頼",
    href: "/projects/new",
    icon: Mic,
  },
  {
    label: "案件一覧",
    href: "/projects",
    icon: FolderOpen,
  },
  {
    label: "メッセージ",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    label: "設定",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-gray-50/50 lg:block">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <UtensilsCrossed className="h-5 w-5 text-orange-600" />
        <span className="text-lg font-bold text-gray-900">
          FoodOEM <span className="text-orange-600">Connect</span>
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-orange-50 text-orange-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
