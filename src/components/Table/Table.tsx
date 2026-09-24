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
import { Spinner } from "../Spinner";
import { AnchoredPopup } from "../AnchoredPopup";

function getCellValue<T>(row: T, col: TableColumn<T>): string | number {
  if (col.accessor) return col.accessor(row);
  return (row as Record<string, unknown>)[col.key] as string | number;
}

function ariaSortFor(
  active: boolean,
  direction: "asc" | "desc" | null,
): "ascending" | "descending" | "none" {
  if (!active || !direction) return "none";
  return direction === "asc" ? "ascending" : "descending";
}

function ColumnFilter({
  header,
  open,
  highlighted,
  onToggle,
  onClose,
  value,
  onChange,
}: {
  header: string;
  open: boolean;
  highlighted: boolean;
  onToggle: () => void;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <span className={styles.filterWrapper} data-fara-table-filter>
      <button
        ref={buttonRef}
        type="button"
        className={clsx(styles.filterButton, highlighted && styles.filterButtonActive)}
        data-fara-table-filter-button
        data-active={highlighted || undefined}
        onClick={onToggle}
        aria-label={`فیلتر ${header}`}
      >
        <FilterIcon />
      </button>

      <AnchoredPopup
        open={open}
        anchorRef={buttonRef}
        onClose={onClose}
        className={styles.filterPopover}
        dataFara="table-filter-popover"
      >
        <input
          autoFocus
          className={styles.filterPopoverInput}
          data-fara-table-filter-input
          placeholder="فیلتر..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </AnchoredPopup>
    </span>
  );
}

export function Table<T>({
  columns,
  data,
  rowKey,
  emptyMessage = "داده‌ای برای نمایش وجود ندارد",
  className,
  maxHeight,
  loading = false,
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

  const {
    enabled: selectionEnabled,
    toggleRow,
    toggleAll,
    isAllSelected,
    isSomeSelected,
    isRowSelected,
  } = useTableSelection({ data: sortedData, pageData: paginatedData, rowKey, config: selection });

  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const rowsToRender = paginatedData;

  return (
    <div data-fara-table className={clsx(styles.wrapper, className)}>
      {searchEnabled && (
        <input
          className={styles.globalSearch}
          data-fara-table-search-input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}

      <div className={styles.tableContainer}>
        {loading && (
          <div className={styles.loadingOverlay} data-fara-table-loading-overlay>
            <Spinner size="lg" />
          </div>
        )}

        <div className={styles.tableScroll} style={maxHeight ? { maxHeight } : undefined}>
          <table className={styles.table} data-fara-table-table>
            <thead className={styles.thead} data-fara-table-head>
              <tr>
                {selectionEnabled && (
                  <th scope="col" className={styles.checkboxCell} data-fara-table-checkbox-cell>
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      className={styles.checkbox}
                      data-fara-table-checkbox
                      checked={isAllSelected}
                      onChange={toggleAll}
                      aria-label="انتخاب همه ردیف‌های این صفحه"
                    />
                  </th>
                )}

                {columns.map((col) => {
                  const isSortable = sortingEnabled && col.sortable;
                  const isFilterable = filteringEnabled && col.filterable;
                  const hasActiveFilter = Boolean(columnFilters[col.key]?.trim());
                  const isActiveSort = sortKey === col.key;

                  return (
                    <th
                      key={col.key}
                      scope="col"
                      className={styles.th}
                      data-fara-table-header-cell
                      aria-sort={isSortable ? ariaSortFor(isActiveSort, sortDirection) : undefined}
                    >
                      <span className={styles.thContent}>
                        {isSortable ? (
                          <button
                            type="button"
                            className={styles.thSortable}
                            onClick={() => toggleSort(col)}
                          >
                            {col.header}
                            <span
                              aria-hidden="true"
                              data-fara-table-sort-icon
                              data-active={isActiveSort || undefined}
                              className={clsx(
                                styles.sortIcon,
                                isActiveSort && styles.sortIconActive,
                              )}
                            >
                              {isActiveSort && sortDirection === "asc" && "▲"}
                              {isActiveSort && sortDirection === "desc" && "▼"}
                              {!isActiveSort && "⇅"}
                            </span>
                          </button>
                        ) : (
                          <span>{col.header}</span>
                        )}

                        {isFilterable && (
                          <ColumnFilter
                            header={col.header}
                            open={openFilterKey === col.key}
                            highlighted={hasActiveFilter}
                            onToggle={() => toggleFilterOpen(col.key)}
                            onClose={closeFilter}
                            value={columnFilters[col.key] ?? ""}
                            onChange={(next) => setColumnFilter(col.key, next)}
                          />
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className={styles.tbody} data-fara-table-body>
              {rowsToRender.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectionEnabled ? 1 : 0)}
                    className={styles.empty}
                    data-fara-table-empty
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rowsToRender.map((row) => {
                  const key = rowKey(row);
                  const selected = isRowSelected(key);

                  return (
                    <tr
                      key={key}
                      data-fara-table-row
                      data-selected={selected || undefined}
                      className={clsx(styles.tr, selected && styles.trSelected)}
                    >
                      {selectionEnabled && (
                        <td className={styles.checkboxCell} data-fara-table-checkbox-cell>
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            data-fara-table-checkbox
                            checked={selected}
                            onChange={() => toggleRow(key)}
                            aria-label={`انتخاب ردیف ${key}`}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className={styles.td} data-fara-table-cell>
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
