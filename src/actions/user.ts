"use server";

import { actionAuth } from "@/lib/hoc-actions";
import { db } from "@/server/db";
import z from "zod";

export const getUserAction = await actionAuth(
  z.object({
    id: z.string(),
  }),
  async ({ data, session }) => {
    const user = await db.user.findUnique({
      where: { id: data.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });
    return user;
  },
);

export const searchUsersAction = await actionAuth(
  z.object({
    query: z.string(),
    excludeSelf: z.boolean().optional(),
    onlyUsers: z.array(z.string()).optional().default([]),
    excludeUsers: z.array(z.string()).optional().default([]),
    excludeBanned: z.boolean().optional().default(true),
    excludeDeleted: z.boolean().optional().default(true),
    projectId: z.string().optional(),
  }),
  async ({ data, session }) => {
    const users = await db.user.findMany({
      where: {
        OR: [
          { name: { contains: data.query, mode: "insensitive" } },
          { email: { contains: data.query, mode: "insensitive" } },
        ],
        ...(data.excludeBanned ? { banned: { not: true } } : {}),
        ...(data.excludeDeleted ? { deletedAt: { not: null } } : {}),
        ...(data.excludeUsers
          ? { id: { notIn: [...data.excludeUsers, session.user.id] } }
          : {
              id: {
                not: data.excludeSelf ? session.user.id : undefined,
              },
            }),
        ...(data.onlyUsers && data.onlyUsers.length > 0
          ? { id: { in: data.onlyUsers } }
          : {}),
        ...(data.projectId
          ? { userProjects: { some: { projectId: data.projectId } } }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return users;
  },
);
