type colDef<T> = {
  label: string;
  key: string;
  cell?: (row: T) => React.ReactNode;
  header?: (row: T) => React.ReactNode;
  footer?: (row: T) => React.ReactNode;
};

type tableProps<T> = {
  data: T[];
  columns: colDef<T>[];
};

export type { colDef, tableProps };
