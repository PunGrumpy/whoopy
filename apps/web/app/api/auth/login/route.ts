import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getAuthorizeUrl } from "@/lib/whoop/api";
import { isWhoopConfigured } from "@/lib/whoop/config";

export const GET = async (request: NextRequest): Promise<Response> => {
  if (!isWhoopConfigured()) {
    return NextResponse.redirect(
      new URL("/?error=not-configured", request.url)
    );
  }

  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("whoop_oauth_state", state, {
    httpOnly: true,
    maxAge: 300,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  const authUrl = getAuthorizeUrl(state);
  return NextResponse.redirect(authUrl);
};
