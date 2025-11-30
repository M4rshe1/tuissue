"use server";

import { db } from "@/server/db";
import { z } from "zod";
import { actionOptionalAuth } from "@/lib/hoc-actions";
import { PROJECT_VISIBILITY } from "@/lib/enums";

function parseQueryFilter(query: string) {}

export const searchIssuesAction = await actionOptionalAuth(
  z.object({
    query: z.string(),
    projectId: z.string().optional(),
  }),
  async ({ data, session }) => {
    const { query, projectId } = data;

    const issueNumberMatch = query.match(/#(\d+)/);
    const projectNameMatch = query.match(/@(\S+)/);
    const textQuery = query.replace(/#\d+/g, "").replace(/@\S+/g, "").trim();

    const projectWhere: any = {};

    if (projectNameMatch) {
      const projectName = projectNameMatch[1];
      projectWhere.name = { contains: projectName, mode: "insensitive" };
    } else if (projectId) {
      projectWhere.id = projectId;
    }

    const projectVisibilityFilter = {
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
              userId: session?.user?.id || "",
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
    };

    const issueWhere: any = {
      project: {
        ...projectWhere,
        ...projectVisibilityFilter,
      },
    };

    if (issueNumberMatch && issueNumberMatch[1]) {
      const issueNumber = parseInt(issueNumberMatch[1], 10);
      issueWhere.number = issueNumber;
    }

    if (textQuery) {
      issueWhere.title = { contains: textQuery, mode: "insensitive" };
    }

    const issues = await db.issue.findMany({
      where: issueWhere,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const shouldReturnProjects =
      projectNameMatch && !issueNumberMatch && !textQuery;

    let projects: Array<{ id: string; name: string }> = [];
    if (shouldReturnProjects) {
      const projectName = projectNameMatch[1];
      projects = await db.project.findMany({
        where: {
          name: { contains: projectName, mode: "insensitive" },
          ...projectVisibilityFilter,
        },
        select: {
          id: true,
          name: true,
        },
        take: 10,
      });
    }

    return { issues, projects };
  },
);
