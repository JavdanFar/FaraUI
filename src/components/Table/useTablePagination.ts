import { useMemo, useState } from "react";
import type { PaginationConfig } from "./types";

interface UseTablePaginationOptions<T> {
  data: T[];
  config: PaginationConfig;
}

const defaultPageSizeOptions = [10, 25, 50];

export function useTablePagination<T>({ data, config }: UseTablePaginationOptions<T>) {
  const enabled = config.enabled ?? false;
  const mode = config.mode ?? "server";
  const isServer = mode === "server";

  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(config.pageSize ?? 10);

  const currentPageSize = isServer ? (config.pageSize ?? 10) : internalPageSize;

  const currentTotalItems = isServer ? (config.totalItems ?? 0) : data.length;

  const totalPages = enabled ? Math.max(1, Math.ceil(currentTotalItems / currentPageSize)) : 1;

  const rawPage = isServer ? (config.page ?? 1) : internalPage;
  const currentPage = Math.min(Math.max(1, rawPage), totalPages);

  const paginatedData = useMemo(() => {
    if (!enabled || isServer) return data;

    const start = (currentPage - 1) * currentPageSize;
    return data.slice(start, start + currentPageSize);
  }, [data, enabled, isServer, currentPage, currentPageSize]);

  function changePage(newPage: number) {
    if (isServer) {
      config.onPageChange?.(newPage);
    } else {
      setInternalPage(newPage);
    }
  }

  function changePageSize(newSize: number) {
    if (isServer) {
      config.onPageSizeChange?.(newSize);
    } else {
      setInternalPageSize(newSize);
      setInternalPage(1);
    }
  }

  return {
    paginatedData,
    page: currentPage,
    setPage: changePage,
    pageSize: currentPageSize,
    changePageSize,
    totalPages,
    totalItems: currentTotalItems,
    pageSizeOptions: config.pageSizeOptions ?? defaultPageSizeOptions,
    enabled,
  };
}
