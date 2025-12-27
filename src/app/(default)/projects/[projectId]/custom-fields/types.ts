import type {
  CustomField as CustomFieldDb,
  CustomFieldDependency,
  CustomFieldOption,
} from "generated/prisma/client";

export type CustomField = CustomFieldDb & {
  customFieldOptions: CustomFieldOption[];
  customFieldDependencies: CustomFieldDependency[];
  customFieldsDepending: CustomFieldDependency[];
};

export type CustomFieldDraft = {
  label: string;
  type: string;
  placeholder: string;
  description: string;
  defaultValue: string;
  required: boolean;
  tableShow: boolean;
  isObsolete: boolean;
  dependencyOperator: string;
  order: number;
  options: Array<{
    id?: string;
    value: string;
    color: string;
    isIssueClosing: boolean;
  }>;
} | null;
