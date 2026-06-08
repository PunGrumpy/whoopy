import type { NewUser, User } from "@whoopy/db";
import { db, users } from "@whoopy/db";
import { eq } from "drizzle-orm";
import { Context, Effect, Layer } from "effect";

class DbError {
  readonly _tag = "DbError";
  readonly error: unknown;
  constructor(error: unknown) {
    this.error = error;
  }
}

interface DatabaseService {
  readonly getUser: (id: string) => Effect.Effect<User | null, DbError>;
  readonly saveUser: (user: NewUser) => Effect.Effect<User, DbError>;
}

export const DatabaseService =
  Context.Service<DatabaseService>("DatabaseService");

export const DatabaseServiceLive = Layer.succeed(
  DatabaseService,
  DatabaseService.of({
    getUser: (id: string) =>
      Effect.tryPromise({
        catch: (error) => new DbError(error),
        try: async () => {
          const [result] = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);
          return result || null;
        },
      }),
    saveUser: (user: NewUser) =>
      Effect.tryPromise({
        catch: (error) => new DbError(error),
        try: async () => {
          const result = await db
            .insert(users)
            .values({
              ...user,
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              set: {
                accessToken: user.accessToken,
                email: user.email,
                expiresAt: user.expiresAt,
                firstName: user.firstName,
                lastName: user.lastName,
                refreshToken: user.refreshToken,
                updatedAt: new Date(),
              },
              target: users.id,
            })
            .returning();
          return result[0];
        },
      }),
  })
);
