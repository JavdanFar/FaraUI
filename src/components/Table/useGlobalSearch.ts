import { useEffect, useMemo, useRef, useState } from "react";
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

  const hasExternalValue = config.value !== undefined;
  const isControlled = hasExternalValue && config.onChange !== undefined;
  const externalTerm = hasExternalValue ? (config.value ?? "") : undefined;

  const [internalTerm, setInternalTerm] = useState(config.value ?? "");
  const [draft, setDraft] = useState(externalTerm ?? internalTerm);
  const [prevExternalTerm, setPrevExternalTerm] = useState(externalTerm);

  if (hasExternalValue && externalTerm !== prevExternalTerm) {
    setPrevExternalTerm(externalTerm);
    setDraft(externalTerm ?? "");
  }

  const committedTerm = hasExternalValue ? (externalTerm ?? "") : internalTerm;

  const committedRef = useRef(committedTerm);
  useEffect(() => {
    committedRef.current = committedTerm;
  });

  const commitRef = useRef<(value: string) => void>(() => {});
  useEffect(() => {
    commitRef.current = (value) => {
      if (!isControlled) setInternalTerm(value);
      config.onChange?.(value);
    };
  });

  useEffect(() => {
    if (draft === committedRef.current) return;

    const handle = setTimeout(() => commitRef.current(draft), DEBOUNCE_MS);

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
