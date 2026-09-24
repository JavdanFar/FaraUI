import { useState } from "react";
import type { SelectionConfig } from "./types";

interface UseTableSelectionOptions<T> {
  data: T[];
  pageData: T[];
  rowKey: (row: T) => string;
  config: SelectionConfig<T>;
}

export function useTableSelection<T>({
  data,
  pageData,
  rowKey,
  config,
}: UseTableSelectionOptions<T>) {
  const enabled = config.enabled ?? false;

  const [internalSelected, setInternalSelected] = useState<string[]>([]);

  const isControlled = config.selectedKeys !== undefined;
  const selectedKeys = isControlled ? config.selectedKeys! : internalSelected;

  function updateSelection(nextKeys: string[]) {
    const selectedRows = data.filter((row) => nextKeys.includes(rowKey(row)));

    if (isControlled) {
      config.onChange?.(nextKeys, selectedRows);
    } else {
      setInternalSelected(nextKeys);
      config.onChange?.(nextKeys, selectedRows);
    }
  }

  function toggleRow(key: string) {
    if (!enabled) return;

    const nextKeys = selectedKeys.includes(key)
      ? selectedKeys.filter((k) => k !== key)
      : [...selectedKeys, key];

    updateSelection(nextKeys);
  }

  function toggleAll() {
    if (!enabled) return;

    const pageKeys = pageData.map(rowKey);
    const allPageSelected =
      pageKeys.length > 0 && pageKeys.every((key) => selectedKeys.includes(key));

    const nextKeys = allPageSelected
      ? selectedKeys.filter((key) => !pageKeys.includes(key))
      : [...selectedKeys.filter((key) => !pageKeys.includes(key)), ...pageKeys];

    updateSelection(nextKeys);
  }

  const pageKeys = pageData.map(rowKey);
  const isAllSelected =
    enabled && pageKeys.length > 0 && pageKeys.every((key) => selectedKeys.includes(key));
  const isSomeSelected =
    enabled && pageKeys.some((key) => selectedKeys.includes(key)) && !isAllSelected;

  return {
    enabled,
    selectedKeys,
    toggleRow,
    toggleAll,
    isAllSelected,
    isSomeSelected,
    isRowSelected: (key: string) => selectedKeys.includes(key),
  };
}
