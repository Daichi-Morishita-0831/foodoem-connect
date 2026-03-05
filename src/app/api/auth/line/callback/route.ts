import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  if (errorParam) {
    return NextResponse.redirect(`${origin}/login?error=line_denied`);
  }

  // CSRF: verify state cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const stateCookie = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("line_oauth_state="));
  const savedState = stateCookie?.split("=")[1]?.trim();

  if (!state || state !== savedState) {
    return NextResponse.redirect(`${origin}/login?error=line_state`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=line_code`);
  }

  const channelId = process.env.LINE_CHANNEL_ID!;
  const channelSecret = process.env.LINE_CHANNEL_SECRET!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  try {
    // 1. Exchange code for tokens
    const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${origin}/api/auth/line/callback`,
        client_id: channelId,
        client_secret: channelSecret,
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      return NextResponse.redirect(`${origin}/login?error=line_token`);
    }

    // 2. Get LINE profile
    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const lineProfile = await profileRes.json();

    // 3. Find or create Supabase user
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    const lineEmail = `line_${lineProfile.userId}@foodoem.local`;

    // Search by LINE user ID in metadata
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    const existingUser = existingUsers?.users?.find(
      (u) => u.user_metadata?.line_user_id === lineProfile.userId
    );

    let userEmail: string;

    if (existingUser) {
      userEmail = existingUser.email!;
    } else {
      // Create new user
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email: lineEmail,
          user_metadata: {
            line_user_id: lineProfile.userId,
            display_name: lineProfile.displayName,
            avatar_url: lineProfile.pictureUrl,
            provider: "line",
          },
          email_confirm: true,
        });

      if (createError || !newUser.user) {
        return NextResponse.redirect(`${origin}/login?error=line_create`);
      }
      userEmail = lineEmail;
    }

    // 4. Generate magic link to create session
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: userEmail,
        options: {
          redirectTo: `${origin}/callback`,
        },
      });

    if (linkError || !linkData?.properties?.hashed_token) {
      return NextResponse.redirect(`${origin}/login?error=line_session`);
    }

    // 5. Redirect through Supabase verify endpoint to set session
    const verifyUrl = `${supabaseUrl}/auth/v1/verify?token=${linkData.properties.hashed_token}&type=magiclink&redirect_to=${encodeURIComponent(`${origin}/callback`)}`;

    const response = NextResponse.redirect(verifyUrl);
    response.cookies.delete("line_oauth_state");
    return response;
  } catch {
    return NextResponse.redirect(`${origin}/login?error=line_error`);
  }
}
