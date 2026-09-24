import { useCallback, useEffect, useMemo, useState } from "react";
import type { TableColumn, FilteringConfig } from "./types";
import { normalizePersianText } from "../../utils/normalizePersianText";

interface UseTableFilterOptions<T> {
  data: T[];
  columns: TableColumn<T>[];
  config: FilteringConfig;
  getCellValue: (row: T, col: TableColumn<T>) => string | number;
}

const emptyFilters: Record<string, string> = {};
const DEBOUNCE_MS = 250;

export function useTableFilter<T>({
  data,
  columns,
  config,
  getCellValue,
}: UseTableFilterOptions<T>) {
  const enabled = config.enabled ?? false;
  const mode = config.mode ?? "client";
  const isServer = mode === "server";

  const externalFilters = isServer ? (config.state ?? emptyFilters) : undefined;

  const [internalFilters, setInternalFilters] = useState<Record<string, string>>({});
  const [draftFilters, setDraftFilters] = useState<Record<string, string>>(externalFilters ?? {});
  const [prevExternalFilters, setPrevExternalFilters] = useState(externalFilters);

  if (isServer && externalFilters !== prevExternalFilters) {
    setPrevExternalFilters(externalFilters);
    setDraftFilters(externalFilters ?? {});
  }

  const committedFilters = isServer ? (externalFilters ?? emptyFilters) : internalFilters;

  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);

  function setColumnFilter(key: string, value: string) {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    if (draftFilters === committedFilters) return;

    const handle = setTimeout(() => {
      if (isServer) {
        config.onChange?.(draftFilters);
      } else {
        setInternalFilters(draftFilters);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [draftFilters]);

  function toggleFilterOpen(key: string) {
    setOpenFilterKey((prev) => (prev === key ? null : key));
  }

  const closeFilter = useCallback(() => {
    setOpenFilterKey(null);
  }, []);

  const filteredData = useMemo(() => {
    if (!enabled || isServer) return data;

    const activeFilters = Object.entries(committedFilters).filter(([, value]) => value.trim());
    if (activeFilters.length === 0) return data;

    return data.filter((row) =>
      activeFilters.every(([key, value]) => {
        const column = columns.find((col) => col.key === key);
        if (!column) return true;
        return normalizePersianText(String(getCellValue(row, column) ?? "")).includes(
          normalizePersianText(value),
        );
      }),
    );
  }, [data, columns, committedFilters, enabled, isServer, getCellValue]);

  return {
    filteredData,
    columnFilters: draftFilters,
    setColumnFilter,
    openFilterKey,
    toggleFilterOpen,
    closeFilter,
    enabled,
  };
}
