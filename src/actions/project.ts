"use server";
import { PROJECT_VISIBILITY } from "@/lib/enums";
import { actionOptionalAuth } from "@/lib/hoc-actions";
import { db } from "@/server/db";
import z from "zod";

export const searchProjectsAction = await actionOptionalAuth(
  z.object({
    query: z.string(),
  }),
  async ({ data, session }) => {
    const { query } = data;
    const projects = await db.project.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
        OR: [
          { visibility: PROJECT_VISIBILITY.PUBLIC },
          {
            visibility: session?.user
              ? PROJECT_VISIBILITY.SEMI_PUBLIC
              : "NOT_ALLOWED",
          },
          { visibility: PROJECT_VISIBILITY.SEMI_PROTECTED },
          {
            visibility: session?.user
              ? PROJECT_VISIBILITY.PROTECTED
              : "NOT_ALLOWED",
          },
          {
            visibility: PROJECT_VISIBILITY.PRIVATE,
            userProjects: {
              some: {
                userId: session?.user?.id ?? "",
              },
            },
          },
          {
            visibility:
              session?.user?.role === "admin"
                ? {
                    in: [
                      PROJECT_VISIBILITY.SEMI_PROTECTED,
                      PROJECT_VISIBILITY.PROTECTED,
                      PROJECT_VISIBILITY.PRIVATE,
                    ],
                  }
                : "NOT_ALLOWED",
          },
        ],
      },
      select: {
        id: true,
        name: true,
      },
    });
    return projects;
  },
);
