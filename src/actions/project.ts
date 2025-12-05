"use server";
import { convertOperatorToPrisma } from "@/lib/condition-search";
import {
  OPERATORS,
  PROJECT_VISIBILITY,
  SETTING_SCOPE,
  USER_PROJECT_ROLE,
} from "@/lib/enums";
import { actionAuth, actionOptionalAuth } from "@/lib/hoc-actions";
import { GLOBAL_SETTINGS } from "@/lib/settings/global";
import { getSettings } from "@/lib/settings/utils";
import { db } from "@/server/db";
import z from "zod";

const searchProjectsSchema = z.object({
  queries: z.array(
    z.object({
      category: z.string(),
      operator: z.enum(Object.values(OPERATORS) as [string, ...string[]]),
      value: z.string(),
      label: z.string().optional(),
      valueLabel: z.string().optional(),
    }),
  ),
  textQuery: z.string(),
});

function parseQueryFilter(
  queries: z.infer<typeof searchProjectsSchema>["queries"],
): Record<string, any> {
  return queries.reduce(
    (
      acc: Record<string, any>,
      query: { category: string; operator: string; value: string },
    ) => ({
      ...acc,
      [query.category]: convertOperatorToPrisma(query.operator, query.value),
    }),
    {},
  );
}

export const searchProjectsAction = await actionOptionalAuth(
  searchProjectsSchema,
  async ({ data, session }) => {
    const { queries, textQuery } = data;
    let prismaQueries = parseQueryFilter(queries);
    prismaQueries = {
      ...prismaQueries,
      ...(textQuery !== ""
        ? {
            name: { contains: textQuery, mode: "insensitive" },
            description: { contains: textQuery, mode: "insensitive" },
          }
        : {}),
    };

    const projects = await db.project.findMany({
      where: {
        ...prismaQueries,
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
        description: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
        inheritCustomFields: true,
        userProjects: true,
      },
    });
    return projects;
  },
);

const createProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  visibility: z.enum(
    Object.values(PROJECT_VISIBILITY) as [string, ...string[]],
  ),
  inheritCustomFields: z.boolean().optional(),
});

export const createProjectAction = await actionAuth(
  createProjectSchema,
  async ({ data, session }) => {
    const { name, description, visibility, inheritCustomFields } = data;
    const settings = await getSettings(
      [
        GLOBAL_SETTINGS.WHO_CAN_CREATE_PROJECTS?.key ?? "",
        GLOBAL_SETTINGS.CUSTOM_CREATE_PROJECT_USERS?.key ?? "",
      ],
      SETTING_SCOPE.GLOBAL,
      undefined,
    );

    if (
      settings[GLOBAL_SETTINGS.WHO_CAN_CREATE_PROJECTS?.key ?? ""] ===
        "ADMIN" &&
      session?.user?.role !== "admin"
    ) {
      throw new Error("Unauthorized");
    }

    if (
      settings[GLOBAL_SETTINGS.WHO_CAN_CREATE_PROJECTS?.key ?? ""] ===
        "CUSTOM" &&
      !settings[
        GLOBAL_SETTINGS.CUSTOM_CREATE_PROJECT_USERS?.key ?? ""
      ]?.includes(session?.user?.id ?? "")
    ) {
      throw new Error("Unauthorized");
    }

    const project = await db.project.create({
      data: {
        name,
        description,
        visibility,
        inheritCustomFields: inheritCustomFields ?? false,
        userProjects: {
          create: {
            userId: session?.user?.id ?? "",
            role: USER_PROJECT_ROLE.OWNER,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        visibility: true,
      },
    });
    console.log(project);
    return project;
  },
);
