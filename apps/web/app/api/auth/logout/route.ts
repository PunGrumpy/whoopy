import { NextResponse } from "next/server";

import { clearSession } from "@/lib/session";

export const GET = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  await clearSession();
  return NextResponse.redirect(new URL("/", url.origin));
};
