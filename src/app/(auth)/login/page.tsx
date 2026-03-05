"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, LogIn, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

const ERROR_MESSAGES: Record<string, string> = {
  auth: "認証に失敗しました。もう一度お試しください。",
  line_not_configured: "LINE ログインはまだ設定されていません。",
  line_denied: "LINE ログインがキャンセルされました。",
  line_error: "LINE ログインに失敗しました。",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "メールアドレスまたはパスワードが正しくありません"
            : error.message
        );
        return;
      }

      router.push("/projects");
      router.refresh();
    } catch {
      setError("ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError("メールアドレスを入力してください");
      return;
    }
    setError(null);
    setSuccess(null);
    setMagicLinkLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(
        "ログインリンクをメールに送信しました。メールを確認してください。"
      );
    } catch {
      setError("送信に失敗しました");
    } finally {
      setMagicLinkLoading(false);
    }
  };

  const displayError =
    error || (urlError ? ERROR_MESSAGES[urlError] || urlError : null);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">ログイン</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {displayError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {displayError}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            {success}
          </div>
        )}

        {/* Social Login */}
        <SocialLoginButtons />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">または</span>
          </div>
        </div>

        {/* Email input (shared) */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            メールアドレス
          </label>
          <Input
            id="email"
            type="email"
            placeholder="example@restaurant.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Magic Link */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleMagicLink}
          disabled={magicLinkLoading}
        >
          {magicLinkLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          ログインリンクをメールで送信
        </Button>

        {/* Password toggle */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mx-auto"
        >
          パスワードでログイン
          {showPassword ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {/* Password form */}
        {showPassword && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                パスワード
              </label>
              <Input
                id="password"
                type="password"
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              ログイン
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-gray-500 w-full">
          アカウントをお持ちでない方は{" "}
          <Link
            href="/register"
            className="font-medium text-orange-600 hover:text-orange-700"
          >
            新規登録
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
