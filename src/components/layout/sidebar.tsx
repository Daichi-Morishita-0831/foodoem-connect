"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderOpen,
  Mic,
  MessageSquare,
  Settings,
  UtensilsCrossed,
  LayoutDashboard,
  LogOut,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types";

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

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-gray-50/50 lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <UtensilsCrossed className="h-5 w-5 text-orange-600" />
        <span className="text-lg font-bold text-gray-900">
          FoodOEM <span className="text-orange-600">Connect</span>
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
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

      {/* ユーザー情報 + ログアウト */}
      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
            <Building2 className="h-4 w-4 text-orange-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {user.company_name}
            </p>
            <p className="text-xs text-gray-500">
              {user.role === "restaurant" ? "飲食店" : "OEM工場"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <LogOut className="h-4 w-4" />
          ログアウト
        </button>
      </div>
    </aside>
  );
}
