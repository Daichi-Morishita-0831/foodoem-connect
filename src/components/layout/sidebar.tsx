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
  ClipboardList,
  UserCircle,
  Users,
  BarChart3,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { NotificationBell } from "./notification-bell";
import type { User, UserRole } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const restaurantNavItems: NavItem[] = [
  { label: "ダッシュボード", href: "/projects", icon: LayoutDashboard },
  { label: "新規依頼", href: "/projects/new", icon: Mic },
  { label: "案件一覧", href: "/projects", icon: FolderOpen },
  { label: "メッセージ", href: "/messages", icon: MessageSquare },
  { label: "設定", href: "/settings", icon: Settings },
];

const oemNavItems: NavItem[] = [
  { label: "ダッシュボード", href: "/oem/dashboard", icon: LayoutDashboard },
  { label: "問い合わせ", href: "/oem/inquiries", icon: ClipboardList },
  { label: "プロフィール", href: "/oem/profile", icon: UserCircle },
  { label: "メッセージ", href: "/messages", icon: MessageSquare },
  { label: "設定", href: "/settings", icon: Settings },
];

const adminNavItems: NavItem[] = [
  { label: "概要", href: "/admin", icon: BarChart3 },
  { label: "ユーザー管理", href: "/admin/users", icon: Users },
  { label: "案件管理", href: "/admin/projects", icon: FolderOpen },
  { label: "設定", href: "/settings", icon: Settings },
];

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case "oem":
      return oemNavItems;
    case "admin":
      return adminNavItems;
    default:
      return restaurantNavItems;
  }
}

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "oem":
      return "OEM工場";
    case "admin":
      return "管理者";
    default:
      return "飲食店";
  }
}

function getRoleIcon(role: UserRole) {
  switch (role) {
    case "admin":
      return Shield;
    default:
      return Building2;
  }
}

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = getNavItems(user.role);
  const RoleIcon = getRoleIcon(user.role);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-gray-50/50 lg:flex lg:flex-col">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-orange-600" />
          <span className="text-lg font-bold text-gray-900">
            FoodOEM <span className="text-orange-600">Connect</span>
          </span>
        </div>
        <NotificationBell userId={user.id} />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/"));
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
            <RoleIcon className="h-4 w-4 text-orange-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {user.company_name}
            </p>
            <p className="text-xs text-gray-500">{getRoleLabel(user.role)}</p>
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
