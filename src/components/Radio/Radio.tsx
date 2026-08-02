import type { InputHTMLAttributes, Ref, ReactNode } from "react";
import { useId } from "react";
import clsx from "clsx";
import styles from "./Radio.module.css";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export function Radio({ label, className, id, ref, ...rest }: RadioProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className={clsx(styles.wrapper, className)}>
      <input ref={ref} type="radio" id={inputId} className={styles.radio} {...rest} />
      {label}
    </label>
  );
}
