import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { keys } from "./keys";
import * as schema from "./schema";

const client = postgres(keys().DATABASE_URL, { prepare: false });
export const db = drizzle(client, { schema });

export * from "./schema";
