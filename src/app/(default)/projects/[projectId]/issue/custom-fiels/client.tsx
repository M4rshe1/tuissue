import { Box } from "@/components/tui/box";
import { H1 } from "@/components/tui/heading";
import Table from "@/components/tui/table";
import type { colDef } from "@/components/tui/table/types";
import { useGetCustomFieldsQuery } from "@/queries/custom-field";
import { useGetProjectQuery } from "@/queries/project";
import { format } from "date-fns";
import type { CustomField } from "generated/prisma/client";

const customFieldsTableColumns: colDef<CustomField>[] = [
  {
    label: "Label",
    key: "label",
  },
  {
    label: "Type",
    key: "type",
  },
  {
    label: "Required",
    key: "required",
  },
  {
    label: "Table Show",
    key: "tableShow",
  },
  {
    label: "Description",
    key: "description",
  },
  {
    label: "Dependency Operator",
    key: "dependencyOperator",
  },
  {
    label: "Created At",
    key: "createdAt",
    cell: (row) => format(row.createdAt, "dd/MM/yyyy HH:mm"),
  },
  {
    label: "Updated At",
    key: "updatedAt",
    cell: (row) => format(row.updatedAt, "dd/MM/yyyy HH:mm"),
  },
];

export default function Client({ projectId }: { projectId: string }) {
  const { data: customFields } = useGetCustomFieldsQuery(projectId);
  const { data: project } = useGetProjectQuery(projectId);
  if (!customFields || !project) {
    return <div>Loading...</div>;
  }
  return (
    <Box
      text={{
        topLeft: <span className="text-foreground">Custom Fields</span>,
        bottomLeft: `/projects/${project.name ?? projectId}/custom-fields`,
      }}
    >
      <H1>Custom Fields</H1>
      <p className="text-muted-foreground text-sm">
        Custom fields are used to add additional information to issues.
      </p>
      <Table data={customFields} columns={customFieldsTableColumns || []} />
    </Box>
  );
}
