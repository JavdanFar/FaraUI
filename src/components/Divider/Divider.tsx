import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import styles from "./Divider.module.css";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: ReactNode;
}

export function Divider({ orientation = "horizontal", label, className, ...rest }: DividerProps) {
  if (label) {
    return (
      <div className={clsx(styles.withLabel, className)} data-fara-divider data-with-label {...rest}>
        <span className={styles.label} data-fara-divider-label>{label}</span>
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      data-fara-divider
      data-orientation={orientation}
      className={clsx(styles.divider, styles[orientation], className)}
      {...rest}
    />
  );
}
