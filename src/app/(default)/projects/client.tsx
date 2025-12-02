"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConditionSearch } from "@/components/tui/condition-search/index";
import type { StructuredQuery } from "@/components/tui/condition-search/types";
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

type Project = DbProject & {
  userProjects: DbUserProject[];
};

const ProjectsClient = () => {
  const [queries, setQueries] = useState<StructuredQuery[]>([]);
  const [textQuery, setTextQuery] = useState("");
  const { data: projects } = useSearchProjectsQuery(queries, textQuery);

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
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
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
      }}
    >
      <div className="flex items-center justify-between">
        <ConditionSearch
          options={searchOptions}
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
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="size-4" />
            New Project
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
