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
  type: string; // Field type like "TEXT", "NUMBER", "USER", etc.
  values: ConditionSearchOptionValue[];
  useAsyncValues?: boolean; // If true, use onFetchValues instead of static values
};

export type ConditionSearchOptionValue = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

export type StructuredQuery = {
  category: string;
  operator: string;
  value: string;
  label?: string;
  valueLabel?: string;
};
