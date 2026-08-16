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
    <div className={styles.pagination}>
      <span className={styles.paginationInfo}>
        نمایش {startItem}-{endItem} از {totalItems}
      </span>

      <div className={styles.paginationControls}>
        <select
          className={styles.pageSizeSelect}
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
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="صفحه قبل"
        >
          ‹
        </button>

        <span className={styles.paginationCurrent}>
          {page} / {totalPages}
        </span>

        <button
          type="button"
          className={styles.paginationButton}
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
