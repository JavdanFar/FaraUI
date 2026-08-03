import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  accessor?: (row: T) => string | number;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  className?: string;
  enableSorting?: boolean;
  enableFiltering?: boolean;
}
