import type { HTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";
import styles from "./NotificationBadge.module.css";

export interface NotificationBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  count?: number;
  variant?: "primary" | "danger";
  showZero?: boolean;
  ref?: Ref<HTMLSpanElement>;
}

export function NotificationBadge({
  children,
  count,
  variant = "primary",
  showZero = false,
  className,
  ref,
  ...rest
}: NotificationBadgeProps) {
  const shouldShow = count !== undefined && (count > 0 || showZero);

  return (
    <span
      ref={ref}
      className={clsx(styles.wrapper, className)}
      data-fara-notification-badge
      {...rest}
    >
      {children}
      {shouldShow && (
        <span
          className={clsx(styles.dot, styles[variant])}
          data-fara-notification-badge-count
          data-variant={variant}
        >
          {count}
        </span>
      )}
    </span>
  );
}
