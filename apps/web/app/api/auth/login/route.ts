import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAuthorizeUrl } from "@/lib/whoop-api";

export const GET = async (): Promise<Response> => {
  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  // 5 minutes
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
