import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TableColumn, FilteringConfig } from "./types";
import { normalizePersianText } from "../../utils/normalizePersianText";

interface UseTableFilterOptions<T> {
  data: T[];
  columns: TableColumn<T>[];
  config: FilteringConfig;
  getCellValue: (row: T, col: TableColumn<T>) => string | number;
}

type FilterMap = Record<string, string>;

const emptyFilters: FilterMap = {};
const DEBOUNCE_MS = 250;

function filtersEqual(a: FilterMap, b: FilterMap): boolean {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => a[key] === b[key]);
}

export function useTableFilter<T>({
  data,
  columns,
  config,
  getCellValue,
}: UseTableFilterOptions<T>) {
  const enabled = config.enabled ?? false;
  const mode = config.mode ?? "client";
  const isServer = mode === "server";
  const hasExternalState = config.state !== undefined;
  const isControlled = hasExternalState && config.onChange !== undefined;

  const externalFilters = hasExternalState ? (config.state ?? emptyFilters) : undefined;

  const [internalFilters, setInternalFilters] = useState<FilterMap>(config.state ?? {});
  const [draftFilters, setDraftFilters] = useState<FilterMap>(config.state ?? {});
  const [prevExternalFilters, setPrevExternalFilters] = useState(externalFilters);

  if (
    hasExternalState &&
    !filtersEqual(externalFilters ?? emptyFilters, prevExternalFilters ?? emptyFilters)
  ) {
    setPrevExternalFilters(externalFilters);
    setDraftFilters(externalFilters ?? {});
  }

  const committedFilters = hasExternalState ? (externalFilters ?? emptyFilters) : internalFilters;

  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);

  function setColumnFilter(key: string, value: string) {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  }

  const committedRef = useRef(committedFilters);
  useEffect(() => {
    committedRef.current = committedFilters;
  });

  const commitRef = useRef<(value: FilterMap) => void>(() => {});
  useEffect(() => {
    commitRef.current = (value) => {
      if (!isControlled) setInternalFilters(value);
      config.onChange?.(value);
    };
  });

  useEffect(() => {
    if (filtersEqual(draftFilters, committedRef.current)) return;

    const handle = setTimeout(() => commitRef.current(draftFilters), DEBOUNCE_MS);

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
