import type { HTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";
import styles from "./Divider.module.css";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Divider({
  orientation = "horizontal",
  label,
  className,
  ref,
  ...rest
}: DividerProps) {
  if (label) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        data-fara-divider
        data-orientation={orientation}
        data-with-label
        className={clsx(styles.withLabel, className)}
        {...rest}
      >
        <span className={styles.label} data-fara-divider-label>
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      data-fara-divider
      data-orientation={orientation}
      className={clsx(styles.divider, styles[orientation], className)}
      {...rest}
    />
  );
}
