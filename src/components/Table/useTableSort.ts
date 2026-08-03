import { useMemo, useState } from "react";
import type { TableColumn, SortDirection } from "./types";

export function useTableSort<T>(
  data: T[],
  columns: TableColumn<T>[],
  enabled: boolean,
  getCellValue: (row: T, col: TableColumn<T>) => string | number,
) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  function toggleSort(col: TableColumn<T>) {
    if (!enabled || !col.sortable) return;

    if (sortKey !== col.key) {
      setSortKey(col.key);
      setSortDirection("asc");
      return;
    }

    if (sortDirection === "asc") {
      setSortDirection("desc");
      return;
    }

    setSortKey(null);
    setSortDirection(null);
  }

  const sortedData = useMemo(() => {
    if (!enabled || !sortKey || !sortDirection) return data;

    const column = columns.find((col) => col.key === sortKey);
    if (!column) return data;

    const result = [...data];
    result.sort((a, b) => {
      const valueA = getCellValue(a, column);
      const valueB = getCellValue(b, column);

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }

      const strA = String(valueA ?? "");
      const strB = String(valueB ?? "");
      return sortDirection === "asc"
        ? strA.localeCompare(strB, "fa")
        : strB.localeCompare(strA, "fa");
    });

    return result;
  }, [data, columns, sortKey, sortDirection, enabled, getCellValue]);

  return { sortedData, sortKey, sortDirection, toggleSort };
}
