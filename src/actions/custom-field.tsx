"use server";

import { PROJECT_VISIBILITY } from "@/lib/enums";
import { actionOptionalAuth } from "@/lib/hoc-actions";
import { getPermission } from "@/lib/permissions";
import { db } from "@/server/db";
import z from "zod";

export const getProjectCustomFieldsAction = await actionOptionalAuth(
  z.object({
    projectId: z.string(),
  }),
  async ({ data, session }) => {
    const { projectId } = data;
    const customFields = await db.customField.findMany({
      where: {
        projectId: projectId,
        project: {
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
      },
      include: {
        customFieldOptions: true,
        customFieldDependencies: true,
        customFieldsDepending: true,
      },
    });
    return customFields;
  },
);

export const createProjectCustomFieldAction = await actionOptionalAuth(
  z.object({
    projectId: z.string(),
    label: z.string(),
    type: z.string(),
    defaultValue: z.string().optional(),
    required: z.boolean().optional(),
    tableShow: z.boolean().optional(),
    description: z.string().optional(),
    dependencyOperator: z.string().optional(),
  }),
  async ({ data, session }) => {
    const {
      projectId,
      label,
      type,
      defaultValue,
      required,
      tableShow,
      description,
      dependencyOperator,
    } = data;

    const userProject = await db.userProject.findFirst({
      where: {
        userId: session?.user?.id ?? "",
        projectId: projectId,
      },
    });

    const permission = getPermission(
      "CUSTOM_FIELD",
      "CREATE",
      userProject?.role as any,
    );

    if (!permission) {
      throw new Error("Unauthorized");
    }

    const customField = await db.customField.create({
      data: {
        label,
        type,
        projectId,
        defaultValue,
        required,
        tableShow,
        description,
        dependencyOperator,
      },
    });
    return customField;
  },
);

export const createProjectCustomFieldOptionAction = await actionOptionalAuth(
  z.object({
    customFieldId: z.string(),
    value: z.string(),
    color: z.string().optional(),
  }),
  async ({ data, session }) => {
    const { customFieldId, value, color } = data;
  },
);

export const deleteProjectCustomFieldAction = await actionOptionalAuth(
  z.object({
    customFieldId: z.string(),
    projectId: z.string(),
  }),
  async ({ data, session }) => {
    const { customFieldId, projectId } = data;
    const userProject = await db.userProject.findFirst({
      where: {
        userId: session?.user?.id ?? "",
        projectId: projectId,
      },
    });
    const permission = getPermission(
      "CUSTOM_FIELD",
      "DELETE",
      userProject?.role as any,
    );
    if (!permission) {
      throw new Error("Unauthorized");
    }
    const customField = await db.customField.delete({
      where: {
        id: customFieldId,
        projectId: projectId,
      },
    });
    return { success: true };
  },
);
