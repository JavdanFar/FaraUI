import type { HTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Badge.module.css";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "danger";
  ref?: Ref<HTMLSpanElement>;
}

export function Badge({ variant = "primary", className, ref, ...rest }: BadgeProps) {
  return <span ref={ref} className={clsx(styles.badge, styles[variant], className)} {...rest} />;
}
