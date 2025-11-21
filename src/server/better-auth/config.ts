import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import type { Session as BetterSession, User } from "better-auth";
import { admin, customSession } from "better-auth/plugins";

import { db } from "@/server/db";
import { Pass } from "./pass";

const options = {
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password: string) => Pass.hash(password),
      verify: async ({ hash, password }: { hash: string; password: string }) =>
        Pass.verify(hash, password),
    },
  },
  plugins: [
    admin({
      impersonationSessionDuration: 3600, // 1 hour
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...options.plugins,
    customSession(async ({ user, session }, _ctx): Promise<CustomSession> => {
      const dbUser = await db.user.findUnique({
        where: { id: user.id },
      });

      if (!dbUser) {
        throw new Error("User not found");
      }

      if ("name" in user) {
        delete (user as Partial<typeof user>).name;
      }

      return {
        user: {
          ...user,
          name: dbUser.name,
          image: dbUser.image,
          role: (dbUser.role ?? "user") as "user" | "admin",
          mustChangePassword: dbUser.mustChangePassword ?? false,
        },
        session,
      };
    }, options),
  ],
});

type CustomSession = {
  user: User & {
    role: "user" | "admin";
    mustChangePassword: boolean;
  };
  session: BetterSession & {
    impersonatedBy?: string | null;
  };
};

export type Session = typeof auth.$Infer.Session;
