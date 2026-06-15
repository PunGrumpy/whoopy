import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  runtimeEnv: {
    SESSION_SECRET: process.env.SESSION_SECRET,
    VERCEL_URL: process.env.VERCEL_URL,
    WHOOP_CLIENT_ID: process.env.WHOOP_CLIENT_ID,
    WHOOP_CLIENT_SECRET: process.env.WHOOP_CLIENT_SECRET,
    WHOOP_REDIRECT_URI: process.env.WHOOP_REDIRECT_URI,
  },
  server: {
    SESSION_SECRET: z.string().optional(),
    VERCEL_URL: z.string().optional(),
    WHOOP_CLIENT_ID: z.string().optional(),
    WHOOP_CLIENT_SECRET: z.string().optional(),
    WHOOP_REDIRECT_URI: z.url().optional(),
  },
  skipValidation: Boolean(process.env.CI),
});
