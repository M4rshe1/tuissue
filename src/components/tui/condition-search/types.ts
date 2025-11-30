import type { CUSTOM_FIELD_TYPE } from "@/lib/enums";

export type FieldType = keyof typeof CUSTOM_FIELD_TYPE;

export type ConditionSearchProps = {
  options: ConditionSearchOption[];
  value?: StructuredQuery[];
  onChange?: (queries: StructuredQuery[]) => void;
  onSearch?: (queries: StructuredQuery[], textQuery: string) => void;
  placeholder?: string;
  onFetchValues?: (
    category: string,
    searchQuery: string,
  ) => Promise<ConditionSearchOptionValue[]>;
  debounceMs?: number;
};

export type ConditionSearchOption = {
  category: string;
  label: string;
  type: FieldType; // Field type from CUSTOM_FIELD_TYPE enum
  values?: ConditionSearchOptionValue[]; // Optional for types that don't use predefined values
  useAsyncValues?: boolean; // If true, use onFetchValues instead of static values
  min?: number; // For NUMBER type
  max?: number; // For NUMBER type
  step?: number; // For NUMBER type
};

export type ConditionSearchOptionValue = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

export type StructuredQuery = {
  category: string;
  operator: string;
  value: string; // For single values OR comma-separated values for multiselect
  label?: string;
  valueLabel?: string;
  selectedValues?: string[]; // For multiselect: array of selected value IDs
  selectedValueLabels?: string[]; // For multiselect: array of selected value labels
};
