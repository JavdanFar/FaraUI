import { useMemo, useState } from "react";
import type { TableColumn, GlobalSearchConfig } from "./types";

interface UseGlobalSearchOptions<T> {
  data: T[];
  columns: TableColumn<T>[];
  config: GlobalSearchConfig;
  getCellValue: (row: T, col: TableColumn<T>) => string | number;
}

export function useGlobalSearch<T>({
  data,
  columns,
  config,
  getCellValue,
}: UseGlobalSearchOptions<T>) {
  const enabled = config.enabled ?? false;
  const mode = config.mode ?? "server";
  const isServer = mode === "server";

  const [internalTerm, setInternalTerm] = useState("");
  const currentTerm = isServer ? (config.value ?? "") : internalTerm;

  function setSearchTerm(value: string) {
    if (isServer) {
      config.onChange?.(value);
    } else {
      setInternalTerm(value);
    }
  }

  const searchedData = useMemo(() => {
    if (!enabled || isServer || !currentTerm.trim()) return data;

    const term = currentTerm.trim().toLowerCase();
    return data.filter((row) =>
      columns.some((col) =>
        String(getCellValue(row, col) ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [data, columns, currentTerm, enabled, isServer, getCellValue]);

  return {
    searchedData,
    searchTerm: currentTerm,
    setSearchTerm,
    enabled,
    placeholder: config.placeholder ?? "جستجو...",
  };
}
