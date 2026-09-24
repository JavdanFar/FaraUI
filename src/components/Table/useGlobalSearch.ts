import { useEffect, useMemo, useState } from "react";
import type { TableColumn, GlobalSearchConfig } from "./types";
import { normalizePersianText } from "../../utils/normalizePersianText";

interface UseGlobalSearchOptions<T> {
  data: T[];
  columns: TableColumn<T>[];
  config: GlobalSearchConfig;
  getCellValue: (row: T, col: TableColumn<T>) => string | number;
}

const DEBOUNCE_MS = 250;

export function useGlobalSearch<T>({
  data,
  columns,
  config,
  getCellValue,
}: UseGlobalSearchOptions<T>) {
  const enabled = config.enabled ?? false;
  const mode = config.mode ?? "client";
  const isServer = mode === "server";

  const externalTerm = isServer ? (config.value ?? "") : undefined;

  const [internalTerm, setInternalTerm] = useState("");
  const [draft, setDraft] = useState(externalTerm ?? internalTerm);
  const [prevExternalTerm, setPrevExternalTerm] = useState(externalTerm);

  if (isServer && externalTerm !== prevExternalTerm) {
    setPrevExternalTerm(externalTerm);
    setDraft(externalTerm ?? "");
  }

  const committedTerm = isServer ? (externalTerm ?? "") : internalTerm;

  useEffect(() => {
    if (draft === committedTerm) return;

    const handle = setTimeout(() => {
      if (isServer) {
        config.onChange?.(draft);
      } else {
        setInternalTerm(draft);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [draft]);

  const searchedData = useMemo(() => {
    if (!enabled || isServer || !committedTerm.trim()) return data;

    const term = normalizePersianText(committedTerm);
    return data.filter((row) =>
      columns.some((col) =>
        normalizePersianText(String(getCellValue(row, col) ?? "")).includes(term),
      ),
    );
  }, [data, columns, committedTerm, enabled, isServer, getCellValue]);

  return {
    searchedData,
    searchTerm: draft,
    setSearchTerm: setDraft,
    enabled,
    placeholder: config.placeholder ?? "جستجو...",
  };
}
