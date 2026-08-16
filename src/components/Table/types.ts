import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc" | null;
export type FeatureMode = "server" | "client";

export interface SortState {
  key: string | null;
  direction: SortDirection;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  accessor?: (row: T) => string | number;
  sortable?: boolean;
  filterable?: boolean;
}

export interface SortingConfig {
  enabled?: boolean;
  mode?: FeatureMode;
  state?: SortState;
  onChange?: (state: SortState) => void;
}

export interface FilteringConfig {
  enabled?: boolean;
  mode?: FeatureMode;
  state?: Record<string, string>;
  onChange?: (filters: Record<string, string>) => void;
}

export interface GlobalSearchConfig {
  enabled?: boolean;
  mode?: FeatureMode;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export interface PaginationConfig {
  enabled?: boolean;
  mode?: FeatureMode;
  page?: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  className?: string;

  sorting?: SortingConfig;
  filtering?: FilteringConfig;
  globalSearch?: GlobalSearchConfig;
  pagination?: PaginationConfig;
  selection?: SelectionConfig<T>;
}

export interface SelectionConfig<T> {
  enabled?: boolean;
  mode?: FeatureMode;
  selectedKeys?: string[];
  onChange?: (selectedKeys: string[], selectedRows: T[]) => void;
}
