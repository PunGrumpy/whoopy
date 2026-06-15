import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { setSession } from "@/lib/session";
import { exchangeCodeForTokens, fetchWhoopProfile } from "@/lib/whoop/api";

export const GET = async (request: NextRequest): Promise<Response> => {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("whoop_oauth_state")?.value;
  cookieStore.delete("whoop_oauth_state");

  if (!code || !state || state !== savedState) {
    return NextResponse.json(
      { error: "Invalid state or code" },
      { status: 400 }
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const profile = await fetchWhoopProfile(tokens.accessToken);
    const expiresAt = new Date(
      Date.now() + tokens.expiresIn * 1000
    ).toISOString();

    await setSession({
      accessToken: tokens.accessToken,
      expiresAt,
      profile,
      refreshToken: tokens.refreshToken,
    });

    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { details: message, error: "Authentication failed" },
      { status: 500 }
    );
  }
};
