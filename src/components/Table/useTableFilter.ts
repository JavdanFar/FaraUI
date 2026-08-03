import { useMemo, useState } from "react";
import type { TableColumn } from "./types";

export function useTableFilter<T>(
  data: T[],
  columns: TableColumn<T>[],
  enabled: boolean,
  getCellValue: (row: T, col: TableColumn<T>) => string | number,
) {
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);

  function setColumnFilter(key: string, value: string) {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFilterOpen(key: string) {
    setOpenFilterKey((prev) => (prev === key ? null : key));
  }

  function closeFilter() {
    setOpenFilterKey(null);
  }

  const filteredData = useMemo(() => {
    if (!enabled) return data;

    const activeFilters = Object.entries(columnFilters).filter(([, value]) => value.trim());
    if (activeFilters.length === 0) return data;

    return data.filter((row) =>
      activeFilters.every(([key, value]) => {
        const column = columns.find((col) => col.key === key);
        if (!column) return true;
        return String(getCellValue(row, column) ?? "")
          .toLowerCase()
          .includes(value.toLowerCase());
      }),
    );
  }, [data, columns, columnFilters, enabled, getCellValue]);

  return {
    filteredData,
    columnFilters,
    setColumnFilter,
    openFilterKey,
    toggleFilterOpen,
    closeFilter,
  };
}
