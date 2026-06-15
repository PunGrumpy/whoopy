import { env } from "@/env";
import type {
  WhoopCycle,
  WhoopData,
  WhoopRecovery,
  WhoopSleep,
  WhoopWorkout,
} from "@/lib/charts/types";

import { getRedirectUri } from "./config";

const WHOOP_BASE_URL = "https://api.prod.whoop.com/developer/v2";

export const getAuthorizeUrl = (state: string): string => {
  const clientId = env.WHOOP_CLIENT_ID;
  if (!clientId) {
    throw new Error("WHOOP_CLIENT_ID is not set");
  }

  const redirectUri = getRedirectUri();

  const scopes = [
    "offline",
    "read:recovery",
    "read:cycles",
    "read:workout",
    "read:sleep",
    "read:profile",
    "read:body_measurement",
  ].join(" ");

  return `https://api.prod.whoop.com/oauth/oauth2/auth?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${encodeURIComponent(state)}`;
};

export interface WhoopTokens {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export const exchangeCodeForTokens = async (
  code: string
): Promise<WhoopTokens> => {
  const clientId = env.WHOOP_CLIENT_ID;
  const clientSecret = env.WHOOP_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("WHOOP credentials are not set");
  }

  const redirectUri = getRedirectUri();

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("code", code);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", redirectUri);

  const response = await fetch(
    "https://api.prod.whoop.com/oauth/oauth2/token",
    {
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to exchange code: ${response.statusText}. Details: ${errorText}`
    );
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
  };
};

export const refreshTokens = async (
  refreshToken: string
): Promise<WhoopTokens> => {
  const clientId = env.WHOOP_CLIENT_ID;
  const clientSecret = env.WHOOP_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("WHOOP credentials are not set");
  }

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const response = await fetch(
    "https://api.prod.whoop.com/oauth/oauth2/token",
    {
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to refresh token: ${response.statusText}. Details: ${errorText}`
    );
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
  };
};

export interface WhoopProfile {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
}

export const fetchWhoopProfile = async (
  accessToken: string
): Promise<WhoopProfile> => {
  const response = await fetch(`${WHOOP_BASE_URL}/user/profile/basic`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    email: data.email,
    firstName: data.first_name,
    id: String(data.user_id),
    lastName: data.last_name,
  };
};

const fetchWhoopCollection = async <T>(
  endpoint: string,
  accessToken: string,
  start: Date,
  end: Date
): Promise<T[]> => {
  const results: T[] = [];
  let nextToken: string | undefined;

  const startStr = start.toISOString();
  const endStr = end.toISOString();

  do {
    const params = new URLSearchParams();
    params.append("end", endStr);
    params.append("limit", "25");
    if (nextToken) {
      params.append("nextToken", nextToken);
    }
    params.append("start", startStr);

    const url = `${WHOOP_BASE_URL}/${endpoint}?${params.toString()}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.records && Array.isArray(data.records)) {
      results.push(...(data.records as T[]));
    }
    nextToken = (data.next_token as string) || undefined;
  } while (nextToken);

  return results;
};

export const fetchWhoopDataForRange = async (
  accessToken: string,
  start: Date,
  end: Date
): Promise<WhoopData> => {
  const [cycles, recoveries, sleeps, workouts] = await Promise.all([
    fetchWhoopCollection<WhoopCycle>("cycle", accessToken, start, end),
    fetchWhoopCollection<WhoopRecovery>("recovery", accessToken, start, end),
    fetchWhoopCollection<WhoopSleep>("activity/sleep", accessToken, start, end),
    fetchWhoopCollection<WhoopWorkout>(
      "activity/workout",
      accessToken,
      start,
      end
    ),
  ]);

  return { cycles, recoveries, sleeps, workouts };
};
