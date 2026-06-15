import { NextResponse } from "next/server";

import { getScreenshotSession, isScreenshotMode } from "@/lib/screenshot-mode";
import { setSession } from "@/lib/session";

export const GET = async (request: Request): Promise<Response> => {
  if (!isScreenshotMode()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await setSession(getScreenshotSession());

  const redirectTo =
    new URL(request.url).searchParams.get("to") ?? "/dashboard";
  return NextResponse.redirect(new URL(redirectTo, request.url));
};
