import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import styles from "./Chip.module.css";

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  onRemove?: () => void;
}

export function Chip({ children, onRemove, className, ...rest }: ChipProps) {
  return (
    <span className={clsx(styles.chip, className)} {...rest}>
      {children}
      {onRemove && (
        <button type="button" className={styles.removeButton} onClick={onRemove} aria-label="حذف">
          ✕
        </button>
      )}
    </span>
  );
}
