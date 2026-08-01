import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./NotificationBadge.module.css";

export interface NotificationBadgeProps {
  children: ReactNode;
  count?: number;
  variant?: "primary" | "danger";
  showZero?: boolean;
}

export function NotificationBadge({
  children,
  count,
  variant = "primary",
  showZero = false,
}: NotificationBadgeProps) {
  const shouldShow = count !== undefined && (count > 0 || showZero);

  return (
    <span className={styles.wrapper}>
      {children}
      {shouldShow && <span className={clsx(styles.dot, styles[variant])}>{count}</span>}
    </span>
  );
}
