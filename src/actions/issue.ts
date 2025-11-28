import { db } from "@/server/db";
import { z } from "zod";
import { OPERATORS, PROJECT_VISIBILITY } from "@/lib/enums";
import { actionAuth, actionProject } from "@/lib/hoc-actions";
import { USER_PROJECT_ROLE } from "@/lib/enums";

function operatorToPrisma(operator: string, inputValue: string) {
  const value = JSON.parse(inputValue);

  switch (operator) {
    case OPERATORS.EQUALS:
      return { equals: value };
    case OPERATORS.NOT_EQUALS:
      return { not: { equals: value } };
    case OPERATORS.CONTAINS:
      return { contains: value };
    case OPERATORS.STARTS_WITH:
      return { startsWith: value };
    case OPERATORS.ENDS_WITH:
      return { endsWith: value };
    case OPERATORS.NOT_CONTAINS:
      return { not: { contains: value } };
    case OPERATORS.NOT_STARTS_WITH:
      return { not: { startsWith: value } };
    case OPERATORS.NOT_ENDS_WITH:
      return { not: { endsWith: value } };
    case OPERATORS.LESS_THAN:
      return { lt: value };
    case OPERATORS.GREATER_THAN:
      return { gt: value };
    case OPERATORS.LESS_THAN_OR_EQUALS:
      return { lte: value };
    case OPERATORS.GREATER_THAN_OR_EQUALS:
      return { gte: value };
    case OPERATORS.IS_IN:
      return { in: value };
    case OPERATORS.IS_NOT_IN:
      return { not: { in: value } };
    case OPERATORS.IS_EMPTY:
      return { equals: "" };
    case OPERATORS.IS_NOT_EMPTY:
      return { not: { equals: "" } };
    default:
      throw new Error("Invalid operator");
  }
}

export const getIssuesFilteredAction = actionProject(
  z.object({
    filterId: z.string(),
  }),
  async ({ data, session }) => {
    const { filterId } = data;
    const filter = await db.filter.findUnique({
      where: { id: filterId },
      include: {
        filterFields: {
          include: {
            customField: true,
          },
        },
      },
    });
    if (!filter) {
      throw new Error("Filter not found");
    }
    const issues = await db.issue.findMany({
      where: {
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
        customFieldValues: {
          some: {
            AND: filter.filterFields.map((field) => ({
              customField: {
                label: field.customField?.label ?? "",
              },
              value: operatorToPrisma(field.operator, field.value),
            })),
          },
        },
      },
    });
    return issues;
  },
);

export const getIssueAction = actionProject(
  z.object({
    issueId: z.string(),
  }),
  async ({ data, session }) => {
    const { issueId } = data;
    const issue = await db.issue.findUnique({
      where: {
        id: issueId,
        project: {
          OR: [
            { visibility: "PUBLIC" },
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
        customFieldValues: {
          include: {
            customField: true,
          },
        },
        creator: true,
        comments: true,
        attachments: true,
        dependencies: {
          include: {
            dependency: true,
          },
        },
        blocking: {
          include: {
            issue: true,
          },
        },
        issueTags: true,
        watcherIssues: true,
      },
    });
    if (!issue) {
      throw new Error("Issue not found");
    }
    return issue;
  },
);

export const createIssueAction = actionAuth(
  z.object({
    title: z.string(),
    summary: z.string(),
    projectId: z.string(),
  }),
  async ({ data, session }) => {
    const { title, summary, projectId } = data;
    const permission = await db.project.findUnique({
      where: {
        id: projectId,
        OR: [
          {
            visibility: {
              in: [PROJECT_VISIBILITY.PUBLIC, PROJECT_VISIBILITY.SEMI_PUBLIC],
            },
          },
          {
            visibility: {
              in: [
                PROJECT_VISIBILITY.SEMI_PROTECTED,
                PROJECT_VISIBILITY.PROTECTED,
                PROJECT_VISIBILITY.PRIVATE,
              ],
            },
            userProjects: {
              some: {
                userId: session?.user?.id ?? "",
                role: { not: USER_PROJECT_ROLE.VIEWER },
              },
            },
          },
          {
            visibility:
              session?.user?.role === "admin"
                ? {
                    in: [
                      PROJECT_VISIBILITY.PRIVATE,
                      PROJECT_VISIBILITY.SEMI_PROTECTED,
                      PROJECT_VISIBILITY.PROTECTED,
                    ],
                  }
                : "NOT_ALLOWED",
            userProjects: {
              some: {
                userId: session?.user?.id ?? "",
                role: { not: USER_PROJECT_ROLE.VIEWER },
              },
            },
          },
        ],
      },
    });
    if (!permission) {
      throw new Error("You are not allowed to create issues in this project");
    }
    const nextIssueNumber = await db.issue.count({
      where: { projectId: projectId },
    });
    const issue = await db.issue.create({
      data: {
        number: nextIssueNumber + 1,
        title,
        summary,
        creatorId: session?.user?.id ?? "",
        projectId,
      },
    });
    return issue;
  },
);
