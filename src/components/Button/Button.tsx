import type { ButtonHTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  ref?: Ref<HTMLButtonElement>;
}

export function Button({ variant = "primary", size = "md", className, ref, ...rest }: ButtonProps) {
  return (
    <button
      ref={ref}
      className={clsx(styles.button, styles[variant], styles[size], className)}
      {...rest}
    />
  );
}
