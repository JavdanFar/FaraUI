import type { InputHTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function Input({ error = false, className, ref, ...rest }: InputProps) {
  return (
    <input ref={ref} className={clsx(styles.input, error && styles.error, className)} {...rest} />
  );
}
