"use client";

import { Box } from "@/components/tui/box";
import { H1 } from "@/components/tui/heading";
import Table from "@/components/tui/table";
import type { colDef } from "@/components/tui/table/types";
import { Button } from "@/components/ui/button";
import { getPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { useShortcuts } from "@/providers/shortcuts-provider";
import {
  useDeleteProjectCustomFieldMutation,
  useGetProjectCustomFieldsQuery,
} from "@/queries/custom-field";
import { useGetProjectQuery } from "@/queries/project";
import { authClient } from "@/server/better-auth/client";
import { format } from "date-fns";
import type {
  CustomField as CustomFieldDb,
  CustomFieldDependency,
} from "generated/prisma/client";
import { Link } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
  const { data: customFields } = useGetProjectCustomFieldsQuery(projectId);
  const { data: project } = useGetProjectQuery(projectId);
  const { data: session } = authClient.useSession();
  const { mutate: deleteCustomField } =
    useDeleteProjectCustomFieldMutation(projectId);
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
  const role = useMemo(() => {
    if (!session?.user?.id) {
      return "";
    }
    return (
      project?.userProjects.find(
        (userProject) => userProject.userId === session?.user?.id,
      )?.role ?? ""
    );
  }, [project, session?.user?.id]);

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
      <div className="flex items-start justify-between gap-4">
        <div className="mt-2 ml-2 flex flex-col">
          <H1>Custom Fields</H1>
          <p className="text-muted-foreground text-sm">
            Custom fields are used to add additional information to issues.
          </p>
        </div>
        <div className="flex gap-2 p-2">
          {getPermission("CUSTOM_FIELD", "CREATE", role) ? (
            <Button className="group flex h-8 items-center" variant="outline">
              Add
            </Button>
          ) : null}
        </div>
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
          <div className="flex flex-col gap-2">
            <div className="flex justify-end gap-2">
              {getPermission("CUSTOM_FIELD", "DELETE", role) ? (
                <Button
                  variant="outlineError"
                  onClick={() => {
                    deleteCustomField({
                      customFieldId: selectedCustomField?.id ?? "",
                    });
                    setSelectedCustomField(null);
                  }}
                >
                  Delete
                </Button>
              ) : null}
              {getPermission("CUSTOM_FIELD", "EDIT", role) ? (
                <Button variant="outline">Save</Button>
              ) : null}
            </div>
          </div>
        </Box>
      </div>
    </Box>
  );
}
