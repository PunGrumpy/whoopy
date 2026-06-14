import { NextResponse } from "next/server";

import { getSession, setSession } from "@/lib/session";
import { fetchWhoopDataForRange, refreshTokens } from "@/lib/whoop-api";

export const GET = async (): Promise<Response> => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let { accessToken } = session;

  try {
    const isExpired =
      new Date(session.expiresAt).getTime() - Date.now() < 5 * 60 * 1000;
    if (isExpired) {
      const tokens = await refreshTokens(session.refreshToken);
      const newExpiresAt = new Date(
        Date.now() + tokens.expiresIn * 1000
      ).toISOString();

      await setSession({
        accessToken: tokens.accessToken,
        expiresAt: newExpiresAt,
        profile: session.profile,
        refreshToken: tokens.refreshToken,
      });

      const { accessToken: nextAccessToken } = tokens;
      accessToken = nextAccessToken;
    }

    const end = new Date();
    const start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const data = await fetchWhoopDataForRange(accessToken, start, end);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { details: message, error: "Failed to fetch WHOOP data" },
      { status: 500 }
    );
  }
};
