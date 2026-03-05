import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function GET(request: Request) {
  const channelId = process.env.LINE_CHANNEL_ID;
  const origin = new URL(request.url).origin;

  if (!channelId) {
    return NextResponse.redirect(`${origin}/login?error=line_not_configured`);
  }

  const state = randomUUID();
  const redirectUri = `${origin}/api/auth/line/callback`;

  const url = new URL("https://access.line.me/oauth2/v2.1/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", channelId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", "profile openid email");

  const response = NextResponse.redirect(url.toString());
  response.cookies.set("line_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}
