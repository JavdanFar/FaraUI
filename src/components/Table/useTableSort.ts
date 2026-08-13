import { useMemo, useState } from "react";
import type { TableColumn, SortState, SortingConfig } from "./types";

interface UseTableSortOptions<T> {
  data: T[];
  columns: TableColumn<T>[];
  config: SortingConfig;
  getCellValue: (row: T, col: TableColumn<T>) => string | number;
}

const emptySortState: SortState = { key: null, direction: null };

export function useTableSort<T>({ data, columns, config, getCellValue }: UseTableSortOptions<T>) {
  const enabled = config.enabled ?? false;
  const mode = config.mode ?? "server";
  const isServer = mode === "server";

  const [internalState, setInternalState] = useState<SortState>(emptySortState);
  const currentState = isServer ? (config.state ?? emptySortState) : internalState;

  function toggleSort(col: TableColumn<T>) {
    if (!enabled || !col.sortable) return;

    let nextState: SortState;

    if (currentState.key !== col.key) {
      nextState = { key: col.key, direction: "asc" };
    } else if (currentState.direction === "asc") {
      nextState = { key: col.key, direction: "desc" };
    } else {
      nextState = emptySortState;
    }

    if (isServer) {
      config.onChange?.(nextState);
    } else {
      setInternalState(nextState);
    }
  }

  const sortedData = useMemo(() => {
    if (!enabled || isServer || !currentState.key || !currentState.direction) return data;

    const column = columns.find((col) => col.key === currentState.key);
    if (!column) return data;

    const direction = currentState.direction;
    const result = [...data];
    result.sort((a, b) => {
      const valueA = getCellValue(a, column);
      const valueB = getCellValue(b, column);

      if (typeof valueA === "number" && typeof valueB === "number") {
        return direction === "asc" ? valueA - valueB : valueB - valueA;
      }

      const strA = String(valueA ?? "");
      const strB = String(valueB ?? "");
      return direction === "asc" ? strA.localeCompare(strB, "fa") : strB.localeCompare(strA, "fa");
    });

    return result;
  }, [data, columns, currentState, enabled, isServer, getCellValue]);

  return {
    sortedData,
    sortKey: currentState.key,
    sortDirection: currentState.direction,
    toggleSort,
    enabled,
  };
}
