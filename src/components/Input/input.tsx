import type { InputHTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Input.module.css";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  error?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function Input({ size = "md", error = false, className, ref, ...rest }: InputProps) {
  return (
    <input
      ref={ref}
      className={clsx(styles.input, styles[size], error && styles.error, className)}
      {...rest}
    />
  );
}
