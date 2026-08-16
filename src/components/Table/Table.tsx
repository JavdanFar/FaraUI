import { useEffect, useRef } from "react";
import clsx from "clsx";
import styles from "./Table.module.css";
import type { TableColumn, TableProps } from "./types";
import { useTableSort } from "./useTableSort";
import { useTableFilter } from "./useTableFilter";
import { useGlobalSearch } from "./useGlobalSearch";
import { useTablePagination } from "./useTablePagination";
import { useTableSelection } from "./useTableSelection";
import { FilterIcon } from "./FilterIcon";
import { TablePagination } from "./TablePagination";

function getCellValue<T>(row: T, col: TableColumn<T>): string | number {
  if (col.accessor) return col.accessor(row);
  return (row as Record<string, unknown>)[col.key] as string | number;
}

export function Table<T>({
  columns,
  data,
  rowKey,
  emptyMessage = "داده‌ای برای نمایش وجود ندارد",
  className,
  sorting = {},
  filtering = {},
  globalSearch = {},
  pagination = {},
  selection = {},
}: TableProps<T>) {
  const {
    searchedData,
    searchTerm,
    setSearchTerm,
    enabled: searchEnabled,
    placeholder: searchPlaceholder,
  } = useGlobalSearch({ data, columns, config: globalSearch, getCellValue });

  const {
    filteredData,
    columnFilters,
    setColumnFilter,
    openFilterKey,
    toggleFilterOpen,
    closeFilter,
    enabled: filteringEnabled,
  } = useTableFilter({ data: searchedData, columns, config: filtering, getCellValue });

  const {
    sortedData,
    sortKey,
    sortDirection,
    toggleSort,
    enabled: sortingEnabled,
  } = useTableSort({ data: filteredData, columns, config: sorting, getCellValue });

  const {
    paginatedData,
    page,
    setPage,
    pageSize,
    changePageSize,
    totalPages,
    totalItems,
    pageSizeOptions,
    enabled: paginationEnabled,
  } = useTablePagination({ data: sortedData, config: pagination });

  // Selection only makes sense across the rows currently visible on screen
  const {
    enabled: selectionEnabled,
    toggleRow,
    toggleAll,
    isAllSelected,
    isSomeSelected,
    isRowSelected,
  } = useTableSelection({ data: paginatedData, rowKey, config: selection });

  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  useEffect(() => {
    if (!openFilterKey) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-table-filter]")) {
        closeFilter();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openFilterKey, closeFilter]);

  const rowsToRender = paginatedData;

  return (
    <div className={clsx(styles.wrapper, className)}>
      {searchEnabled && (
        <input
          className={styles.globalSearch}
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              {selectionEnabled && (
                <th className={styles.checkboxCell}>
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isAllSelected}
                    onChange={toggleAll}
                    aria-label="انتخاب همه ردیف‌ها"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isSortable = sortingEnabled && col.sortable;
                const isFilterable = filteringEnabled && col.filterable;
                const hasActiveFilter = Boolean(columnFilters[col.key]?.trim());

                return (
                  <th key={col.key} className={styles.th}>
                    <span className={styles.thContent}>
                      <span
                        onClick={() => isSortable && toggleSort(col)}
                        className={clsx(isSortable && styles.thSortable)}
                      >
                        {col.header}
                      </span>

                      {isSortable && (
                        <span
                          onClick={() => toggleSort(col)}
                          className={clsx(
                            styles.sortIcon,
                            sortKey === col.key && styles.sortIconActive,
                          )}
                        >
                          {sortKey === col.key && sortDirection === "asc" && "▲"}
                          {sortKey === col.key && sortDirection === "desc" && "▼"}
                          {sortKey !== col.key && "⇅"}
                        </span>
                      )}

                      {isFilterable && (
                        <span className={styles.filterWrapper} data-table-filter>
                          <button
                            type="button"
                            className={clsx(
                              styles.filterButton,
                              hasActiveFilter && styles.filterButtonActive,
                            )}
                            onClick={() => toggleFilterOpen(col.key)}
                            aria-label={`فیلتر ${col.header}`}
                          >
                            <FilterIcon />
                          </button>

                          {openFilterKey === col.key && (
                            <span className={styles.filterPopover}>
                              <input
                                autoFocus
                                className={styles.filterPopoverInput}
                                placeholder="فیلتر..."
                                value={columnFilters[col.key] ?? ""}
                                onChange={(e) => setColumnFilter(col.key, e.target.value)}
                              />
                            </span>
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className={styles.tbody}>
            {rowsToRender.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectionEnabled ? 1 : 0)} className={styles.empty}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rowsToRender.map((row) => {
                const key = rowKey(row);
                const selected = isRowSelected(key);

                return (
                  <tr key={key} className={clsx(styles.tr, selected && styles.trSelected)}>
                    {selectionEnabled && (
                      <td className={styles.checkboxCell}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={selected}
                          onChange={() => toggleRow(key)}
                          aria-label={`انتخاب ردیف ${key}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={styles.td}>
                        {col.render ? col.render(row) : String(getCellValue(row, col) ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {paginationEnabled && totalItems > 0 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageChange={setPage}
          onPageSizeChange={changePageSize}
        />
      )}
    </div>
  );
}
