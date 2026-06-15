import { env } from "@/env";

const LOCAL_ORIGIN = "http://localhost:3000";
const OAUTH_CALLBACK_PATH = "/api/auth/callback";

export const getRedirectUri = (): string => {
  if (env.WHOOP_REDIRECT_URI) {
    return env.WHOOP_REDIRECT_URI;
  }
  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}${OAUTH_CALLBACK_PATH}`;
  }
  return `${LOCAL_ORIGIN}${OAUTH_CALLBACK_PATH}`;
};

export const isWhoopConfigured = (): boolean =>
  Boolean(env.WHOOP_CLIENT_ID && env.WHOOP_CLIENT_SECRET && env.SESSION_SECRET);
