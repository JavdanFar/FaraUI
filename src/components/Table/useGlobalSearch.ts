import { useMemo, useState } from "react";
import type { TableColumn } from "./types";

export function useGlobalSearch<T>(
  data: T[],
  columns: TableColumn<T>[],
  enabled: boolean,
  getCellValue: (row: T, col: TableColumn<T>) => string | number,
) {
  const [searchTerm, setSearchTerm] = useState("");

  const searchedData = useMemo(() => {
    if (!enabled || !searchTerm.trim()) return data;

    const term = searchTerm.trim().toLowerCase();
    return data.filter((row) =>
      columns.some((col) =>
        String(getCellValue(row, col) ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [data, columns, searchTerm, enabled, getCellValue]);

  return { searchedData, searchTerm, setSearchTerm };
}
