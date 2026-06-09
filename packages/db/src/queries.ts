import { eq } from "drizzle-orm";

import { db } from "./index";
import { users } from "./schema";
import type { NewUser, User } from "./schema";

export const getUser = async (id: string): Promise<User | null> => {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return result || null;
};

export const saveUser = async (user: NewUser): Promise<User> => {
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
};
