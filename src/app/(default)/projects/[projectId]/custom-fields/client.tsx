"use client";

import { Box } from "@/components/tui/box";
import { H1 } from "@/components/tui/heading";
import Table from "@/components/tui/table";
import type { colDef } from "@/components/tui/table/types";
import { Button } from "@/components/ui/button";
import { CustomFieldDetailsPanel } from "./details-panel";
import {
  CUSTOM_FIELD_DEPENDENCY_OPERATOR,
  CUSTOM_FIELD_TYPE,
} from "@/lib/enums";
import { getPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { useShortcuts } from "@/providers/shortcuts-provider";
import {
  useDeleteProjectCustomFieldMutation,
  useGetProjectCustomFieldsQuery,
  useUpdateProjectCustomFieldMutation,
} from "@/queries/custom-field";
import { useGetProjectQuery } from "@/queries/project";
import { authClient } from "@/server/better-auth/client";
import { useEffect, useMemo, useState } from "react";
import type { CustomField, CustomFieldDraft } from "./types";

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
  const { mutate: updateCustomField, isPending: isSaving } =
    useUpdateProjectCustomFieldMutation(projectId);
  const [selectedCustomField, setSelectedCustomField] =
    useState<CustomField | null>(null);

  const role = useMemo(() => {
    if (!session?.user?.id || !project) {
      return "";
    }
    return (
      project?.userProjects.find(
        (userProject) => userProject.userId === session?.user?.id,
      )?.role ?? ""
    );
  }, [project, session?.user?.id]);

  const canEdit = getPermission("CUSTOM_FIELD", "EDIT", role);
  const canDelete = getPermission("CUSTOM_FIELD", "DELETE", role);
  const canCreate = getPermission("CUSTOM_FIELD", "CREATE", role);

  const [draft, setDraft] = useState<CustomFieldDraft>(null);

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

  useEffect(() => {
    if (!selectedCustomField) {
      setDraft(null);
      return;
    }
    setDraft({
      label: selectedCustomField.label ?? "",
      type: selectedCustomField.type ?? "TEXT",
      placeholder: selectedCustomField.placeholder ?? "",
      description: selectedCustomField.description ?? "",
      defaultValue: selectedCustomField.defaultValue ?? "",
      required: !!selectedCustomField.required,
      tableShow: !!selectedCustomField.tableShow,
      isObsolete: !!selectedCustomField.isObsolete,
      dependencyOperator: selectedCustomField.dependencyOperator ?? "AND",
      order: selectedCustomField.order ?? 0,
      options: (selectedCustomField.customFieldOptions ?? []).map((o) => ({
        id: o.id,
        value: o.value ?? "",
        color: o.color ?? "#64748b",
        isIssueClosing: !!o.isIssueClosing,
      })),
    });
  }, [selectedCustomField?.id]);

  async function handleSave() {
    if (!draft || !selectedCustomField) {
      return;
    }
    const selectionTypes: string[] = [
      CUSTOM_FIELD_TYPE.SELECT,
      CUSTOM_FIELD_TYPE.MULTI_SELECT,
      CUSTOM_FIELD_TYPE.STATE,
    ];
    const shouldSendOptions = selectionTypes.includes(draft.type);

    updateCustomField(
      {
        customFieldId: selectedCustomField.id,
        label: draft.label,
        type: draft.type,
        placeholder: draft.placeholder || null,
        description: draft.description || null,
        defaultValue: draft.defaultValue || null,
        required: draft.required,
        tableShow: draft.tableShow,
        isObsolete: draft.isObsolete,
        dependencyOperator: draft.dependencyOperator || null,
        order: draft.order,
        options: shouldSendOptions
          ? draft.options.map((o) => ({
              id: o.id,
              value: o.value,
              color: o.color,
              isIssueClosing: o.isIssueClosing,
            }))
          : [],
      },
      {
        onSuccess: (result) => {
          if (result) {
            setSelectedCustomField(result as any);
          }
        },
      },
    );
  }

  if (!customFields || !project) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      text={{
        topLeft: (
          <span className="text-foreground">{project.name ?? projectId}</span>
        ),
        bottomLeft: `/projects/${project.name ? `[${project.name}]` : projectId}/custom-fields`,
      }}
      style={{
        content: "flex flex-col gap-2 overflow-hidden",
      }}
      className={`transition-all duration-300 ${selectedCustomField ? "w-2/3" : "w-full"}`}
    >
      <div className="flex shrink-0 items-start justify-between gap-4">
        <div className="mt-2 ml-2 flex flex-col">
          <H1>Custom Fields</H1>
          <p className="text-muted-foreground text-sm">
            Custom fields are used to add additional information to issues.
          </p>
        </div>
        <div className="flex gap-2 p-2">
          {canCreate ? (
            <Button
              size="sm"
              className="group flex h-8 items-center"
              variant="outline"
            >
              Add
            </Button>
          ) : null}
        </div>
      </div>
      <div
        className={cn(
          "flex h-full flex-row overflow-hidden transition-all duration-300",
        )}
      >
        <Table
          data={customFields}
          columns={customFieldsTableColumns || []}
          onRowClick={(row) => setSelectedCustomField(row)}
        />
        <CustomFieldDetailsPanel
          selectedCustomField={selectedCustomField}
          draft={draft}
          setDraft={setDraft}
          canEdit={canEdit}
          canDelete={canDelete}
          isSaving={isSaving}
          onClose={() => setSelectedCustomField(null)}
          onSave={handleSave}
          onDelete={(customFieldId) => {
            deleteCustomField({ customFieldId });
            setSelectedCustomField(null);
          }}
        />
      </div>
    </Box>
  );
}
