import type { HTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";
import styles from "./Chip.module.css";

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  ref?: Ref<HTMLSpanElement>;
}

export function Chip({
  children,
  onRemove,
  removeLabel = "حذف",
  className,
  ref,
  ...rest
}: ChipProps) {
  return (
    <span
      ref={ref}
      className={clsx(styles.chip, className)}
      data-fara-chip
      data-removable={onRemove ? true : undefined}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          className={styles.removeButton}
          data-fara-chip-remove
          onClick={onRemove}
          aria-label={removeLabel}
        >
          ✕
        </button>
      )}
    </span>
  );
}
