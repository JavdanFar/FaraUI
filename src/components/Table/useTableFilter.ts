import { useCallback, useMemo, useState } from "react";
import type { TableColumn, FilteringConfig } from "./types";

interface UseTableFilterOptions<T> {
  data: T[];
  columns: TableColumn<T>[];
  config: FilteringConfig;
  getCellValue: (row: T, col: TableColumn<T>) => string | number;
}

const emptyFilters: Record<string, string> = {};

export function useTableFilter<T>({
  data,
  columns,
  config,
  getCellValue,
}: UseTableFilterOptions<T>) {
  const enabled = config.enabled ?? false;
  const mode = config.mode ?? "server";
  const isServer = mode === "server";

  const [internalFilters, setInternalFilters] = useState<Record<string, string>>({});

  const currentFilters = useMemo(
    () => (isServer ? (config.state ?? emptyFilters) : internalFilters),
    [isServer, config.state, internalFilters],
  );

  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);

  function setColumnFilter(key: string, value: string) {
    const next = { ...currentFilters, [key]: value };

    if (isServer) {
      config.onChange?.(next);
    } else {
      setInternalFilters(next);
    }
  }

  function toggleFilterOpen(key: string) {
    setOpenFilterKey((prev) => (prev === key ? null : key));
  }

  const closeFilter = useCallback(() => {
    setOpenFilterKey(null);
  }, []);

  const filteredData = useMemo(() => {
    if (!enabled || isServer) return data;

    const activeFilters = Object.entries(currentFilters).filter(([, value]) => value.trim());
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
  }, [data, columns, currentFilters, enabled, isServer, getCellValue]);

  return {
    filteredData,
    columnFilters: currentFilters,
    setColumnFilter,
    openFilterKey,
    toggleFilterOpen,
    closeFilter,
    enabled,
  };
}
