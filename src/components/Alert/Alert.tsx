import type { HTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Alert.module.css";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  icon?: React.ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Alert({ variant = "info", icon, className, children, ref, ...rest }: AlertProps) {
  return (
    <div
      ref={ref}
      role="alert"
      className={clsx(styles.alert, styles[variant], className)}
      {...rest}
    >
      {icon}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
