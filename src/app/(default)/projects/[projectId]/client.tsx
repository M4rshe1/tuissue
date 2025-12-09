"use client";

import { Box } from "@/components/tui/box";
import { Button } from "@/components/ui/button";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useGetProjectQuery } from "@/queries/project";
import { Eye, FileText, Plus, Loader2, Settings2 } from "lucide-react";
import Link from "next/link";
import type { colDef } from "@/components/tui/table/types";
import Table from "@/components/tui/table";
import { authClient } from "@/server/better-auth/client";
import { useMemo } from "react";
import { getPermission } from "@/lib/permissions";
import { AsciiChar } from "@/components/tui/ascii-char";
import { formatDate } from "date-fns";

const ProjectOverviewSkeleton = ({ projectId }: { projectId: string }) => {
  return (
    <Box
      style={{
        background: "bg-background",
        content: "flex flex-col items-center justify-center gap-4",
      }}
      text={{
        topLeft: "Project",
        bottomLeft: `/projects/${projectId}`,
      }}
    >
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    </Box>
  );
};

const roleColors: Record<string, string> = {
  OWNER: "text-amber-500",
  ADMIN: "text-rose-500",
  QA: "text-violet-500",
  CONTRIBUTOR: "text-emerald-500",
  VIEWER: "text-slate-500",
  REPORTER: "text-sky-500",
};

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
};

const membersTableColumns: colDef<Member>[] = [
  {
    label: "Name",
    key: "name",
    cell: (row) => {
      return (
        <Link
          href={`/user/profile/${row.id}`}
          className="text-primary hover:text-foreground justify-left flex w-full cursor-pointer items-center hover:underline"
        >
          {row.name}
        </Link>
      );
    },
  },
  {
    label: "Email",
    key: "email",
    cell: (row) => {
      return (
        <Link
          href={`mailto:${row.email}`}
          target="_blank"
          className="text-muted-foreground hover:text-foreground flex w-full cursor-pointer justify-center hover:underline"
        >
          {row.email}
        </Link>
      );
    },
  },
  {
    label: "Role",
    key: "role",
    cell: (row) => {
      return <span className={cn(roleColors[row.role])}>{row.role}</span>;
    },
  },
];

type Issue = {
  id: string;
  number: number;
  title: string;
  createdAt: Date;
};

const recentIssuesTableColumns: colDef<Issue>[] = [
  {
    label: "No.",
    key: "number",
    header: (icon: React.ReactNode) => {
      return (
        <span className="text-foreground flex w-full items-center justify-center">
          No. {icon}
        </span>
      );
    },
    cell: (row) => {
      return (
        <Link
          href={`issue/${row.id}`}
          className="text-primary hover:text-foreground flex w-full cursor-pointer justify-center hover:underline"
        >
          {row.number}
        </Link>
      );
    },
  },
  {
    label: "Summary",
    key: "title",
    cell: (row) => {
      return (
        <Link
          href={`issue/${row.id}`}
          className="text-primary hover:text-foreground flex w-full cursor-pointer justify-center hover:underline"
        >
          <span className="text-muted-foreground hover:text-foreground truncate">
            {row.title}
          </span>
        </Link>
      );
    },
  },
  {
    label: "Created At",
    key: "createdAt",
    cell: (row) => {
      return (
        <span
          className="text-muted-foreground"
          title={formatDate(new Date(row.createdAt), "MMM d, yyyy @ HH:mm:ss")}
        >
          {formatRelativeTime(row.createdAt)}
        </span>
      );
    },
  },
];

const Client = ({ projectId }: { projectId: string }) => {
  const { data: project, isPending } = useGetProjectQuery(projectId);
  const { data: session } = authClient.useSession();

  const role = useMemo(() => {
    return (
      project?.userProjects.find(
        (userProject) => userProject.userId === session?.user?.id,
      )?.role ?? ""
    );
  }, [project, session?.user?.id]);

  const visibilityLabel =
    {
      PUBLIC: "Public",
      SEMI_PUBLIC: "Semi-Public",
      PROTECTED: "Protected",
      SEMI_PROTECTED: "Semi-Protected",
      PRIVATE: "Private",
    }[project?.visibility ?? ""] ??
    project?.visibility ??
    "";

  const visibilityShortLabel =
    {
      PUBLIC: "PUB",
      SEMI_PUBLIC: "SPC",
      PROTECTED: "PRO",
      SEMI_PROTECTED: "SPR",
      PRIVATE: "PRV",
    }[project?.visibility ?? ""] ??
    project?.visibility ??
    "";

  if (isPending || !project) {
    return <ProjectOverviewSkeleton projectId={projectId} />;
  }

  const createdAt = formatDate(project.createdAt, "MMM d, yyyy @ HH:mm");
  const updatedAt = formatDate(project.updatedAt, "MMM d, yyyy @ HH:mm");
  const isUpdated = updatedAt !== createdAt;
  const updatedAtText = isUpdated ? ` · Updated ${updatedAt}` : "";

  return (
    <Box
      style={{
        background: "bg-background",
        content: "flex flex-col gap-4",
      }}
      text={{
        topLeft: project.name,
        bottomLeft: `/projects/[${project.name}]`,
        bottomRight: `Created ${createdAt}${updatedAtText}`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 p-4">
          <AsciiChar value={project.name} className="text-primary" size="lg" />
          {project.description && (
            <p className="text-muted-foreground mt-2 text-sm">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {getPermission("PROJECT", "EDIT", role) ? (
            <Button
              asChild
              className="group flex h-8 items-center"
              variant="outline"
            >
              <Link href={`/projects/${project.id}/settings`}>Edit</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Box
          text={{
            topLeft: <span className="text-foreground">Issues</span>,
            bottomRight: (
              <Link
                href={`/projects/${project.id}/issue`}
                className="text-muted-foreground hover:text-foreground justify-left flex w-full cursor-pointer items-center hover:underline"
              >
                View All
              </Link>
            ),
          }}
          style={{
            content: "flex flex-col items-center justify-center gap-2 p-6",
          }}
        >
          <AsciiChar value={project._count.issues} className="text-primary" />
        </Box>
        <Box
          text={{
            topLeft: <span className="text-foreground">Members</span>,
            bottomRight: (
              <Link
                href={`/projects/${project.id}/members`}
                className="text-muted-foreground hover:text-foreground justify-left flex w-full cursor-pointer items-center hover:underline"
              >
                View All
              </Link>
            ),
          }}
          style={{
            content: "flex flex-col items-center justify-center gap-2",
          }}
        >
          <AsciiChar
            value={project.userProjects.length}
            className="text-primary"
          />
        </Box>
        <Box
          text={{
            topLeft: <span className="text-foreground">Custom Fields</span>,
            bottomRight: getPermission("CUSTOM_FIELD", "EDIT", role) ? (
              <Link
                href={`/projects/${project.id}/custom-fields`}
                className="text-muted-foreground hover:text-foreground justify-left flex w-full cursor-pointer items-center hover:underline"
              >
                Manage
              </Link>
            ) : null,
          }}
          style={{
            content: "flex flex-col items-center justify-center gap-2",
          }}
        >
          <AsciiChar
            value={project._count.customFields}
            className="text-primary"
          />
        </Box>
        <Box
          text={{
            topLeft: <span className="text-foreground">Visibility</span>,
            bottomRight: getPermission("PROJECT", "EDIT", role) ? (
              <Link
                href={`/projects/${project.id}/settings`}
                className="text-muted-foreground hover:text-foreground justify-left flex w-full cursor-pointer items-center hover:underline"
              >
                Change
              </Link>
            ) : null,
          }}
          style={{
            content: "flex flex-col items-center justify-center gap-2",
          }}
          title={visibilityLabel}
        >
          <AsciiChar value={visibilityShortLabel} className="text-primary" />
        </Box>
      </div>

      {/* Main Content Grid */}
      <div className="grid flex-1 gap-4 md:grid-cols-2">
        {project.issues.length === 0 ? (
          <div className="text-muted-foreground flex flex-1 items-center justify-center py-8 text-sm">
            No issues yet.{" "}
            <Link
              href={`/projects/${project.id}/issue/new`}
              className="text-primary ml-1 hover:underline"
            >
              Create one
            </Link>
          </div>
        ) : (
          <Table
            box={{
              text: {
                topLeft: (
                  <span className="text-foreground text-sm">Recent Issues</span>
                ),
                bottomRight: (
                  <Link
                    href={`/projects/${project.id}/issue`}
                    className="text-muted-foreground hover:text-foreground justify-left flex w-full cursor-pointer items-center hover:underline"
                  >
                    View All
                  </Link>
                ),
              },
              style: {
                content: "pt-1",
              },
            }}
            data={project.issues.map((issue) => ({
              id: issue.id,
              number: issue.number,
              title: issue.title,
              createdAt: issue.createdAt,
            }))}
            columns={recentIssuesTableColumns}
          />
        )}

        <Table
          box={{
            text: {
              topLeft: <span className="text-foreground text-sm">Members</span>,
            },
            style: {
              content: "pt-1",
            },
          }}
          data={project.userProjects.map((userProject) => ({
            name: userProject.user.name,
            email: userProject.user.email,
            role: userProject.role,
            id: userProject.user.id,
            image: userProject.user.image,
          }))}
          columns={membersTableColumns}
        />
      </div>
    </Box>
  );
};

export default Client;
