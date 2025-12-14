"use client";

import { Box } from "@/components/tui/box";
import { H1 } from "@/components/tui/heading";
import Table from "@/components/tui/table";
import type { colDef } from "@/components/tui/table/types";
import { cn } from "@/lib/utils";
import { useShortcuts } from "@/providers/shortcuts-provider";
import { useGetCustomFieldsQuery } from "@/queries/custom-field";
import { useGetProjectQuery } from "@/queries/project";
import { format } from "date-fns";
import type {
  CustomField as CustomFieldDb,
  CustomFieldDependency,
} from "generated/prisma/client";
import { useEffect, useState } from "react";

type CustomField = CustomFieldDb & {
  customFieldDependencies: CustomFieldDependency[];
  customFieldsDepending: CustomFieldDependency[];
};

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
    label: "Order",
    key: "order",
  },
  {
    label: "Is Obsolete",
    key: "isObsolete",
    cell: (row) => (row.isObsolete ? "Yes" : "No"),
  },
  {
    label: "dependencies",
    key: "customFieldDependencies",
    cell: (row) => row.customFieldDependencies.length || "-",
  },
  {
    label: "Depending",
    key: "customFieldsDepending",
    cell: (row) => row.customFieldsDepending.length || "-",
  },
];

export default function Client({ projectId }: { projectId: string }) {
  const { data: customFields } = useGetCustomFieldsQuery(projectId);
  const { data: project } = useGetProjectQuery(projectId);
  const [selectedCustomField, setSelectedCustomField] =
    useState<CustomField | null>(null);
  const { addShortcut, removeShortcut } = useShortcuts();
  useEffect(() => {
    if (!selectedCustomField) {
      return;
    }
    addShortcut({
      id: "close-custom-field-details",
      label: "Close",
      escKey: true,
      letters: [],
      action: () => {
        setSelectedCustomField(null);
      },
    });
    return () => {
      removeShortcut("close-custom-field-details");
    };
  }, [selectedCustomField]);
  if (!customFields || !project) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      text={{
        topLeft: <span className="text-foreground">Custom Fields</span>,
        bottomLeft: `/projects/${project.name ? `[${project.name}]` : projectId}/custom-fields`,
      }}
      style={{
        content: "flex flex-col gap-2",
      }}
      className={`transition-all duration-300 ${selectedCustomField ? "w-2/3" : "w-full"}`}
    >
      <div className="mt-2 ml-2 flex flex-col">
        <H1>Custom Fields</H1>
        <p className="text-muted-foreground text-sm">
          Custom fields are used to add additional information to issues.
        </p>
      </div>
      <div className={cn("flex h-full flex-row transition-all duration-300")}>
        <Table
          data={customFields}
          columns={customFieldsTableColumns || []}
          onRowClick={(row) => setSelectedCustomField(row)}
        />
        <Box
          text={{
            topLeft: (
              <span className="text-foreground">
                Details of {selectedCustomField?.label}
              </span>
            ),
          }}
          onClose={() => setSelectedCustomField(null)}
          style={{
            box: `overflow-hidden transition-all duration-300 ${selectedCustomField ? "w-1/3" : "invisible w-0 m-0 px-0"}`,
          }}
        >
          {selectedCustomField && <div>d</div>}
        </Box>
      </div>
    </Box>
  );
}
