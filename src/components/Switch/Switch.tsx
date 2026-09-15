import type { InputHTMLAttributes, Ref, ReactNode } from "react";
import { useId } from "react";
import clsx from "clsx";
import styles from "./Switch.module.css";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function Switch({ label, className, id, ref, ...rest }: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} data-fara-switch className={clsx(styles.wrapper, className)}>
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        id={inputId}
        data-fara-switch-input
        className={styles.input}
        {...rest}
      />
      <span data-fara-switch-track className={styles.track}>
        <span data-fara-switch-thumb className={styles.thumb} />
      </span>
      {label}
    </label>
  );
}
