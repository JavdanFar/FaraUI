import type { HTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./ProgressBar.module.css";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  variant?: "primary" | "success" | "danger";
  label?: string;
  showValue?: boolean;
  indeterminate?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function ProgressBar({
  value = 0,
  variant = "primary",
  label,
  showValue = false,
  indeterminate = false,
  className,
  ref,
  ...rest
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div ref={ref} data-fara-progress-bar className={className} {...rest}>
      {(label || showValue) && (
        <div className={styles.labelRow} data-fara-progress-label-row>
          <span>{label}</span>
          {showValue && !indeterminate && <span>{clampedValue}%</span>}
        </div>
      )}

      <div
        className={styles.track}
        data-fara-progress-track
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={clsx(
            styles.fill,
            variant !== "primary" && styles[variant],
            indeterminate && styles.indeterminate,
          )}
          data-fara-progress-fill
          data-variant={variant}
          data-indeterminate={indeterminate || undefined}
          style={indeterminate ? undefined : { width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
