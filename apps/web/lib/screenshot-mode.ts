import type { SessionPayload } from "@/lib/session";

export const isScreenshotMode = (): boolean =>
  process.env.SCREENSHOT_MODE === "true";

export const getScreenshotSession = (): SessionPayload => ({
  accessToken: "screenshot-access-token",
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  profile: {
    email: "alex.runner@whoopy.app",
    firstName: "Alex",
    id: "portfolio-demo",
    lastName: "Runner",
  },
  refreshToken: "screenshot-refresh-token",
});
