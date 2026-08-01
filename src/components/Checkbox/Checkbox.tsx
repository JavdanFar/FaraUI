import type { InputHTMLAttributes, Ref, ReactNode } from "react";
import { useId } from "react";
import clsx from "clsx";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function Checkbox({ label, className, id, ref, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className={clsx(styles.wrapper, className)}>
      <input ref={ref} type="checkbox" id={inputId} className={styles.checkbox} {...rest} />
      {label}
    </label>
  );
}
