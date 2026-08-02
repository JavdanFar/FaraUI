import type { HTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Spinner.module.css";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  ref?: Ref<HTMLSpanElement>;
}

export function Spinner({ size = "md", className, ref, ...rest }: SpinnerProps) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label="در حال بارگذاری"
      className={clsx(styles.spinner, styles[size], className)}
      {...rest}
    />
  );
}
