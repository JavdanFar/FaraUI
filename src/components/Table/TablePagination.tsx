import styles from "./Table.module.css";

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className={styles.pagination} data-fara-table-pagination>
      <span className={styles.paginationInfo} data-fara-table-pagination-info aria-live="polite">
        نمایش {startItem}-{endItem} از {totalItems}
      </span>

      <div className={styles.paginationControls} data-fara-table-pagination-controls>
        <select
          className={styles.pageSizeSelect}
          data-fara-table-page-size-select
          aria-label="تعداد ردیف در هر صفحه"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={styles.paginationButton}
          data-fara-table-pagination-button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="صفحه قبل"
        >
          ‹
        </button>

        <span className={styles.paginationCurrent} data-fara-table-pagination-current>
          {page} / {totalPages}
        </span>

        <button
          type="button"
          className={styles.paginationButton}
          data-fara-table-pagination-button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="صفحه بعد"
        >
          ›
        </button>
      </div>
    </div>
  );
}
