import type { HTMLAttributes, Ref } from "react";
import clsx from "clsx";
import { Radio } from "./Radio";
import styles from "./Radio.module.css";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  disabled = false,
  className,
  ref,
  ...rest
}: RadioGroupProps) {
  return (
    <div
      ref={ref}
      data-fara-radio-group
      role="radiogroup"
      aria-orientation="vertical"
      className={clsx(styles.group, className)}
      {...rest}
    >
      {options.map((opt) => (
        <Radio
          key={opt.value}
          name={name}
          label={opt.label}
          value={opt.value}
          checked={value === opt.value}
          onChange={() => onChange?.(opt.value)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
