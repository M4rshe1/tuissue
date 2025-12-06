"use client";

import { useEffect, useState } from "react";
import { ConditionSearch } from "@/components/tui/condition-search/index";
import type {
  ConditionSearchOption,
  StructuredQuery,
} from "@/components/tui/condition-search/types";
import Table from "@/components/tui/table";
import type { colDef } from "@/components/tui/table/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSearchProjectsQuery } from "@/queries/project";
import { PROJECT_VISIBILITY } from "@/lib/enums";
import type {
  Project as DbProject,
  UserProject as DbUserProject,
} from "generated/prisma/client";
import { Box } from "@/components/tui/box";
import Link from "next/link";
import { useShortcuts } from "@/providers/shortcuts-provider";
import { useRouter } from "next/navigation";

type Project = DbProject & {
  userProjects: DbUserProject[];
};

const ProjectsClient = () => {
  const [queries, setQueries] = useState<StructuredQuery[]>([]);
  const [textQuery, setTextQuery] = useState("");
  const { data: projects } = useSearchProjectsQuery(queries, textQuery);
  const { addShortcut, removeShortcut } = useShortcuts();
  const router = useRouter();

  useEffect(() => {
    addShortcut({
      id: "new-project",
      label: "New Project",
      ctrlKey: true,
      letters: ["N"],
      action: () => {
        router.push("/projects/new");
      },
    });
    return () => {
      removeShortcut("new-project");
    };
  }, []);

  const searchOptions = [
    {
      category: "name",
      label: "Name",
      type: "TEXT" as const,
      values: [],
    },
    {
      category: "description",
      label: "Description",
      type: "TEXT_AREA" as const,
      values: [],
    },
    {
      category: "visibility",
      label: "Visibility",
      type: "SELECT" as const,
      values: Object.values(PROJECT_VISIBILITY).map((visibility) => ({
        value: visibility,
        label: visibility,
      })),
    },
    {
      category: "created-at",
      label: "Created At",
      type: "DATE_TIME" as const,
      values: [],
    },
    {
      category: "updated-at",
      label: "Updated At",
      type: "DATE_TIME" as const,
      values: [],
    },
  ];

  const columns: colDef<Project>[] = [
    {
      label: "Name",
      key: "name",
      cell: (row) => (
        <Link
          href={`/projects/${row.id}`}
          className="text-primary hover:underline"
        >
          {row.name}
        </Link>
      ),
    },
    {
      label: "Description",
      key: "description",
      cell: (row) => (
        <span className="text-muted-foreground">{row.description}</span>
      ),
    },
    {
      label: "Visibility",
      key: "visibility",
      cell: (row) => row.visibility,
    },
    {
      label: "Created At",
      key: "createdAt",
      cell: (row) => new Date(row.createdAt).toISOString(),
    },
    {
      label: "Updated At",
      key: "updatedAt",
      cell: (row) => new Date(row.updatedAt).toISOString(),
    },
  ];

  function handleSearchQueries(queries: StructuredQuery[], textQuery: string) {
    setQueries(queries);
    setTextQuery(textQuery);
  }

  return (
    <Box
      style={{
        background: "bg-background",
        content: "flex flex-col",
      }}
      text={{
        topLeft: "Projects",
        bottomLeft: "/projects",
      }}
    >
      <div className="flex items-center justify-between">
        <ConditionSearch
          options={searchOptions as ConditionSearchOption[]}
          value={queries}
          onChange={setQueries}
          onSearch={handleSearchQueries}
          placeholder="Search projects or add a filter"
          boxProps={{
            style: {
              background: "bg-background",
              content: "p-2",
            },
          }}
        />
        <Button
          asChild
          className="group mr-2 flex items-center gap-0 transition-all duration-300 hover:gap-2"
        >
          <Link href="/projects/new">
            <Plus className="size-4" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-xs">
              New Project
            </span>
          </Link>
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <Table data={projects as Project[]} columns={columns} />
      </div>
    </Box>
  );
};

export default ProjectsClient;
