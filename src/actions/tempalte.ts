import {
  CUSTOM_FIELD_TYPE,
  OPERATORS,
  PROJECT_VISIBILITY,
  SETTING_SCOPE,
} from "@/lib/enums";
import { actionAdmin } from "@/lib/hoc-actions";
import { db } from "@/server/db";
import z from "zod";

type TemplateField = {
  name: string;
  type: (typeof CUSTOM_FIELD_TYPE)[keyof typeof CUSTOM_FIELD_TYPE];
  required: boolean;
  options?: { value: string; color: string; isIssueClosing?: boolean }[];
};

type Template = {
  name: string;
  description: string;
  fields: TemplateField[];
  settings: TemplateSetting[];
  filters: TemplateFilter[];
};

type TemplateFilter = {
  name: string;
  isDefault: boolean;
  description: string;
  fields: TemplateFilterField[];
};

type TemplateFilterField = {
  field: string;
  value: string | number | boolean | string[] | number[] | boolean[] | null;
  operator: (typeof OPERATORS)[keyof typeof OPERATORS];
};

type TemplateSetting = {
  key: string;
  value: string | number | boolean | string[] | number[] | boolean[] | null;
};

const TEMPLATES: Template[] = [
  {
    name: "Basic Issue Tracking",
    description: "A basic issue tracking template with simple fields",
    fields: [
      {
        name: "State",
        type: CUSTOM_FIELD_TYPE.SELECT,
        required: true,
        options: [
          { value: "OPEN", color: "#FF0000", isIssueClosing: false },
          { value: "IN PROGRESS", color: "#FFFF00", isIssueClosing: false },
          { value: "CLOSED", color: "#00FF00", isIssueClosing: true },
        ],
      },
      {
        name: "Priority",
        type: CUSTOM_FIELD_TYPE.SELECT,
        required: true,
        options: [
          { value: "LOW", color: "#00FF00" },
          { value: "MEDIUM", color: "#FFFF00" },
          { value: "HIGH", color: "#FF0000" },
        ],
      },
      {
        name: "Assignee",
        type: CUSTOM_FIELD_TYPE.USER,
        required: true,
      },
    ],
    settings: [
      {
        key: "DEFAULT_ISSUE_STATE",
        value: "OPEN",
      },
      {
        key: "DEFAULT_ORDER_BY",
        value: "Number",
      },
      {
        key: "DEFAULT_ORDER_DIRECTION",
        value: "desc",
      },
      {
        key: "DEFAULT_TABLE_COLUMNS",
        value: ["Number", "Summary", "State", "Priority", "Assignee"],
      },
    ],
    filters: [
      {
        name: "All Issues",
        isDefault: false,
        description: "All issues",
        fields: [],
      },
      {
        name: "Open Issues",
        isDefault: true,
        description: "Issues that are open",
        fields: [
          {
            field: "State",
            operator: OPERATORS.IS_IN,
            value: ["OPEN", "IN PROGRESS"],
          },
        ],
      },
      {
        name: "Assigned to Me",
        isDefault: false,
        description: "Issues that are assigned to me",
        fields: [
          {
            field: "Assignee",
            operator: OPERATORS.IS_IN,
            value: ["@me"],
          },
        ],
      },
    ],
  },
];

export const createFromTemplateAction = await actionAdmin(
  z.object({
    templateName: z.string(),
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    image: z.string().optional(),
    visibility: z
      .enum(Object.values(PROJECT_VISIBILITY) as [string, ...string[]])
      .optional(),
  }),
  async ({ data }) => {
    const template = TEMPLATES.find(
      (template) => template.name === data.templateName,
    );
    if (!template) {
      throw new Error("Template not found");
    }
    const project = await db.project.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        visibility: data.visibility ?? PROJECT_VISIBILITY.PRIVATE,
        inheritCustomFields: false,
        settings: {
          createMany: {
            data: [
              ...template.settings.map((setting) => ({
                key: setting.key,
                value: JSON.stringify(setting.value),
                scope: SETTING_SCOPE.PROJECT,
              })),
            ],
          },
        },
      },
    });
    await db.customField.createMany({
      data: template.fields.map((field) => ({
        label: field.name,
        type: field.type,
        projectId: project.id,
        required: field.required,
        ...(field.options
          ? {
              customFieldOptions: {
                create: field.options.map((option) => ({
                  value: option.value,
                  color: option.color,
                  isIssueClosing:
                    "isIssueClosing" in option ? option.isIssueClosing : false,
                })),
              },
            }
          : {}),
      })),
    });
    const customFields = await db.customField.findMany({
      where: {
        projectId: project.id,
      },
      select: {
        id: true,
        label: true,
      },
    });

    await db.filter.createMany({
      data: template.filters.map((filter) => ({
        name: filter.name,
        description: filter.description,
        isDefault: filter.isDefault,
        projectId: project.id,
        filterFields: {
          create: filter.fields.map((field) => ({
            customFieldId: customFields.find(
              (customField) => customField.label === field.field,
            )?.id,
            operator: field.operator,
            value: JSON.stringify(field.value),
          })),
        },
      })),
    });
    return project;
  },
);
