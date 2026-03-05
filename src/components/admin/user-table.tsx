"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toggleUserActive } from "@/lib/supabase/actions/admin";
import { roleLabels } from "@/lib/constants";
import type { User, UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function UserTable({ users: initialUsers }: { users: User[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [users, setUsers] = useState(initialUsers);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.company_name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    const result = await toggleUserActive(userId, !currentActive);
    if ("error" in result) {
      alert(result.error);
      return;
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, is_active: !currentActive } : u
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          placeholder="会社名またはIDで検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-1">
          {(["all", "restaurant", "oem", "admin"] as const).map((role) => (
            <Button
              key={role}
              variant={roleFilter === role ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter(role)}
              className={roleFilter === role ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              {role === "all" ? "すべて" : roleLabels[role]}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/80">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">会社名</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">ロール</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">登録日</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="font-medium text-gray-900 hover:text-orange-600"
                      >
                        {user.company_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">
                        {roleLabels[user.role] ?? user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          user.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {user.is_active ? "有効" : "無効"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(user.created_at).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleToggleActive(user.id, user.is_active)
                        }
                      >
                        {user.is_active ? "無効化" : "有効化"}
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      該当するユーザーが見つかりません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
