"use client";

import type { HTMLAttributes, Ref } from "react";
import { useState } from "react";
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
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function RadioGroup({
  name,
  options,
  value,
  defaultValue,
  onChange,
  disabled = false,
  className,
  ref,
  ...rest
}: RadioGroupProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  function handleChange(optionValue: string) {
    if (!isControlled) setInternalValue(optionValue);
    onChange?.(optionValue);
  }

  return (
    <div
      ref={ref}
      tabIndex={-1}
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
          checked={currentValue === opt.value}
          onChange={() => handleChange(opt.value)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
