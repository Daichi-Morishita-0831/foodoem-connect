import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 認証不要のパス
const publicPaths = ["/login", "/register", "/callback", "/"];
// 認証不要のパスプレフィックス（公開ページ）
const publicPrefixes = ["/oem/"];
// 認証済みだがプロフィール未完了でもアクセス可能なパス
const setupPaths = ["/setup"];

// ロール別のデフォルトパス
const roleDefaultPaths: Record<string, string> = {
  restaurant: "/projects",
  oem: "/oem/dashboard",
  admin: "/admin",
};

// ロール別のアクセス許可プレフィックス
const roleAllowedPrefixes: Record<string, string[]> = {
  restaurant: ["/projects", "/messages", "/settings"],
  oem: ["/oem", "/messages", "/settings"],
  admin: ["/admin", "/projects", "/oem", "/messages", "/settings"],
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // API routes と static assets は除外
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    return supabaseResponse;
  }

  // 公開プレフィックスに一致するパスは認証不要（/oem/[uuid]形式の公開ページ）
  const isPublicPrefix = publicPrefixes.some((prefix) => {
    if (!pathname.startsWith(prefix)) return false;
    // /oem/dashboard, /oem/profile 等のダッシュボードパスは除外
    const rest = pathname.slice(prefix.length);
    return /^[0-9a-f-]{36}/.test(rest);
  });

  // 未認証 + 保護パス → ログインにリダイレクト
  if (!user && !publicPaths.some((p) => pathname === p) && !setupPaths.includes(pathname) && !isPublicPrefix) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 認証済み + ログイン/登録ページ → ロール別ダッシュボードにリダイレクト
  if (user && (pathname === "/login" || pathname === "/register")) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    url.pathname = roleDefaultPaths[profile?.role ?? "restaurant"] ?? "/projects";
    return NextResponse.redirect(url);
  }

  // 認証済み + ロール別アクセス制御
  if (user && !publicPaths.includes(pathname) && !setupPaths.includes(pathname) && !isPublicPrefix) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile) {
      const role = profile.role as string;
      const allowed = roleAllowedPrefixes[role] ?? [];

      // 許可されていないパスへのアクセス → ロール別デフォルトにリダイレクト
      const isAllowed = allowed.some((prefix) => pathname.startsWith(prefix));
      if (!isAllowed && pathname !== "/") {
        const url = request.nextUrl.clone();
        url.pathname = roleDefaultPaths[role] ?? "/projects";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
