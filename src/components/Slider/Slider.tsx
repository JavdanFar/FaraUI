import type { InputHTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Slider.module.css";

export interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "onChange"
> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  label?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = false,
  label,
  disabled,
  className,
  ref,
  ...rest
}: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={clsx(styles.wrapper, className)}>
      {(label || showValue) && (
        <div className={styles.labelRow}>
          <span>{label}</span>
          {showValue && <span>{value}</span>}
        </div>
      )}

      <div className={clsx(styles.track, disabled && styles.disabled)}>
        <div className={styles.fill} style={{ width: `${percent}%` }} />
        <div className={styles.thumb} style={{ insetInlineStart: `${percent}%` }} />

        <input
          ref={ref}
          type="range"
          className={styles.input}
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          {...rest}
        />
      </div>
    </div>
  );
}
