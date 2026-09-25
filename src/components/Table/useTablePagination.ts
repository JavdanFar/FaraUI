import { useMemo, useState } from "react";
import type { PaginationConfig } from "./types";

interface UseTablePaginationOptions<T> {
  data: T[];
  config: PaginationConfig;
}

const defaultPageSizeOptions = [10, 25, 50];

export function useTablePagination<T>({ data, config }: UseTablePaginationOptions<T>) {
  const enabled = config.enabled ?? false;
  const mode = config.mode ?? "client";
  const isServer = mode === "server";

  if (import.meta.env.DEV && enabled && isServer && config.totalItems === undefined) {
    console.warn(
      '[fara-ui] Table: pagination.mode is "server" but pagination.totalItems was not provided, so the pagination controls will not render. Pass pagination.totalItems, or set pagination.mode="client" to paginate the given data array automatically.',
    );
  }

  const [internalPage, setInternalPage] = useState(config.page ?? 1);
  const [internalPageSize, setInternalPageSize] = useState(config.pageSize ?? 10);
  const isPageControlled = config.page !== undefined && config.onPageChange !== undefined;
  const isPageSizeControlled =
    config.pageSize !== undefined && config.onPageSizeChange !== undefined;

  const currentPageSize = isPageSizeControlled ? (config.pageSize ?? 10) : internalPageSize;
  const currentTotalItems = isServer ? (config.totalItems ?? 0) : data.length;
  const totalPages = enabled ? Math.max(1, Math.ceil(currentTotalItems / currentPageSize)) : 1;

  const rawPage = isPageControlled ? (config.page ?? 1) : internalPage;
  const currentPage = Math.min(Math.max(1, rawPage), totalPages);

  const paginatedData = useMemo(() => {
    if (!enabled || isServer) return data;

    const start = (currentPage - 1) * currentPageSize;
    return data.slice(start, start + currentPageSize);
  }, [data, enabled, isServer, currentPage, currentPageSize]);

  function changePage(newPage: number) {
    if (!isPageControlled) setInternalPage(newPage);
    config.onPageChange?.(newPage);
  }

  function changePageSize(newSize: number) {
    if (!isPageSizeControlled) setInternalPageSize(newSize);
    if (!isPageControlled) setInternalPage(1);
    config.onPageSizeChange?.(newSize);
    config.onPageChange?.(1);
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
