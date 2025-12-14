type colDefBase<T> = {
  label: string;
  header?: (icon: React.ReactNode) => React.ReactNode;
  footer?: () => React.ReactNode;
};

type valueColDef<T> = colDefBase<T> & {
  key: keyof T;
  cell?: (row: T) => React.ReactNode;
};

type actionDef<T> = colDefBase<T> & {
  key: "actions";
  cell?: (row: T) => React.ReactNode;
  inline?: boolean;
};

type colDef<T> = valueColDef<T> | actionDef<T>;

type tableProps<T> = {
  data: T[];
  columns: colDef<T>[];
  onRowClick?: (row: T) => void;
};

export type { colDef, tableProps };
