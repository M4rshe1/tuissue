"use server";

import { PROJECT_VISIBILITY } from "@/lib/enums";
import { actionOptionalAuth } from "@/lib/hoc-actions";
import {
  CUSTOM_FIELD_DEPENDENCY_OPERATOR,
  CUSTOM_FIELD_TYPE,
} from "@/lib/enums";
import { getPermission } from "@/lib/permissions";
import { db } from "@/server/db";
import z from "zod";

const CUSTOM_FIELD_TYPE_VALUES = Object.values(CUSTOM_FIELD_TYPE) as [
  string,
  ...string[],
];
const CUSTOM_FIELD_DEPENDENCY_OPERATOR_VALUES = Object.values(
  CUSTOM_FIELD_DEPENDENCY_OPERATOR,
) as [string, ...string[]];

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

export const updateProjectCustomFieldAction = await actionOptionalAuth(
  z.object({
    projectId: z.string(),
    customFieldId: z.string(),
    label: z.string().min(1).max(255).optional(),
    type: z.enum(CUSTOM_FIELD_TYPE_VALUES).optional(),
    placeholder: z.string().nullable().optional(),
    tableShow: z.boolean().optional(),
    defaultValue: z.string().nullable().optional(),
    isObsolete: z.boolean().optional(),
    description: z.string().nullable().optional(),
    dependencyOperator: z
      .enum(CUSTOM_FIELD_DEPENDENCY_OPERATOR_VALUES)
      .nullable()
      .optional(),
    required: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
    options: z
      .array(
        z.object({
          id: z.string().optional(),
          value: z.string().min(1),
          color: z.string().nullable().optional(),
          isIssueClosing: z.boolean().optional(),
          userId: z.string().nullable().optional(),
        }),
      )
      .optional(),
  }),
  async ({ data, session }) => {
    const { projectId, customFieldId, options, ...patch } = data;

    const userProject = await db.userProject.findFirst({
      where: {
        userId: session?.user?.id ?? "",
        projectId,
      },
    });

    const permission = getPermission(
      "CUSTOM_FIELD",
      "EDIT",
      userProject?.role as any,
    );

    if (!permission) {
      throw new Error("Unauthorized");
    }

    const updated = await db.$transaction(async (tx) => {
      const customField = await tx.customField.update({
        where: {
          id: customFieldId,
          projectId,
        },
        data: {
          ...patch,
        },
      });

      if (options) {
        const existing = await tx.customFieldOption.findMany({
          where: { customFieldId },
          select: { id: true },
        });
        const existingIds = new Set(existing.map((o) => o.id));
        const incomingIds = new Set(
          options.map((o) => o.id).filter(Boolean) as string[],
        );

        const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
        if (toDelete.length) {
          await tx.customFieldOption.deleteMany({
            where: { id: { in: toDelete } },
          });
        }

        const toUpdate = options.filter((o) => o.id && existingIds.has(o.id));
        for (const opt of toUpdate) {
          await tx.customFieldOption.update({
            where: { id: opt.id! },
            data: {
              value: opt.value,
              color: opt.color ?? undefined,
              isIssueClosing: opt.isIssueClosing ?? false,
              userId: opt.userId ?? undefined,
            },
          });
        }

        const toCreate = options.filter((o) => !o.id);
        if (toCreate.length) {
          await tx.customFieldOption.createMany({
            data: toCreate.map((o) => ({
              customFieldId,
              value: o.value,
              color: o.color ?? undefined,
              isIssueClosing: o.isIssueClosing ?? false,
              userId: o.userId ?? undefined,
            })),
          });
        }
      }

      return tx.customField.findFirst({
        where: { id: customFieldId, projectId },
        include: {
          customFieldOptions: true,
          customFieldDependencies: true,
          customFieldsDepending: true,
        },
      });
    });

    return updated;
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
