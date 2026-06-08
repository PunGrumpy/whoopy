import { defineConfig } from "drizzle-kit";

import { keys } from "./src/keys";

export default defineConfig({
  dbCredentials: {
    url: keys().DATABASE_URL,
  },
  dialect: "postgresql",
  out: "./migrations",
  schema: "./src/schema.ts",
});
