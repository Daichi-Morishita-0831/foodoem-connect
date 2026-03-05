"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Check } from "lucide-react";
import type { UserRole } from "@/types";

export default function SetupPage() {
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<UserRole>("restaurant");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Already has profile → go to dashboard
      const { data: profile } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profile) {
        router.push("/projects");
        return;
      }

      setUserId(user.id);
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: profileError } = await supabase.from("users").insert({
        id: userId,
        role,
        company_name: companyName,
      });

      if (profileError) {
        setError("プロフィール作成に失敗しました: " + profileError.message);
        return;
      }

      if (role === "oem") {
        await supabase.from("oem_profiles").insert({
          user_id: userId,
        });
      }

      router.push("/projects");
      router.refresh();
    } catch {
      setError("設定に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">プロフィール設定</CardTitle>
        <CardDescription className="text-center">
          アカウント情報を入力して登録を完了してください
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">アカウント種別</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("restaurant")}
                className={`rounded-lg border-2 p-3 text-center text-sm transition-colors ${
                  role === "restaurant"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="block text-lg">&#x1F37D;&#xFE0F;</span>
                <span className="font-medium">飲食店</span>
                <span className="block text-xs text-gray-500">
                  OEM工場を探す
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole("oem")}
                className={`rounded-lg border-2 p-3 text-center text-sm transition-colors ${
                  role === "oem"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="block text-lg">&#x1F3ED;</span>
                <span className="font-medium">OEM工場</span>
                <span className="block text-xs text-gray-500">
                  案件を受注する
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium">
              会社名 / 店舗名
            </label>
            <Input
              id="company"
              type="text"
              placeholder="例: 〇〇食堂"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            登録を完了する
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
