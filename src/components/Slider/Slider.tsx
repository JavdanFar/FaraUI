import { useRef, useState } from "react";
import type { InputHTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Slider.module.css";

export interface SliderRangeValue {
  min: number;
  max: number;
}

export interface SliderBaseProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "onChange" | "min" | "max"
> {
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  label?: string;
  formatValue?: (value: number) => string;
}

export interface SliderProps extends SliderBaseProps {
  range?: false;
  value: number;
  onChange: (value: number) => void;
  ref?: Ref<HTMLInputElement>;
}

export interface SliderRangeProps extends SliderBaseProps {
  range: true;
  value: SliderRangeValue;
  onChange: (value: SliderRangeValue) => void;
  ref?: Ref<HTMLInputElement>;
}

interface DragState {
  activeHandle: "min" | "max" | null;
}

export function Slider(props: SliderProps | SliderRangeProps) {
  const {
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    showValue = false,
    label,
    formatValue,
    disabled,
    className,
    ref,
    ...rest
  } = props;

  const trackRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({ activeHandle: null });

  const isRange = props.range === true;

  const valueMin = isRange ? (value as SliderRangeValue).min : min;
  const valueMax = isRange ? (value as SliderRangeValue).max : (value as number);

  const percentMin = ((valueMin - min) / (max - min)) * 100;
  const percentMax = ((valueMax - min) / (max - min)) * 100;

  function clamp(value: number): number {
    return Math.max(min, Math.min(max, value));
  }

  function roundToStep(value: number): number {
    const stepped = Math.round((value - min) / step) * step + min;
    return clamp(Number(stepped.toFixed(4)));
  }

  function valueFromPointer(clientX: number): number | null {
    const track = trackRef.current;
    if (!track) return null;
    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return roundToStep(clamp(min + ratio * (max - min)));
  }

  function pickHandle(clientX: number): "min" | "max" {
    const pointer = valueFromPointer(clientX);
    if (pointer === null) return "min";
    const distanceToMin = Math.abs(pointer - valueMin);
    const distanceToMax = Math.abs(pointer - valueMax);
    return distanceToMin <= distanceToMax ? "min" : "max";
  }

  function commitRange(nextMin: number, nextMax: number) {
    const clampedMin = Math.min(nextMin, nextMax);
    const clampedMax = Math.max(nextMin, nextMax);
    (onChange as SliderRangeProps["onChange"])({ min: clampedMin, max: clampedMax });
  }

  function commitSingle(next: number) {
    (onChange as SliderProps["onChange"])(next);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    if (event.button !== 0) return;

    const handle = isRange ? pickHandle(event.clientX) : "max";
    setDragState({ activeHandle: handle });

    const pointerValue = valueFromPointer(event.clientX);
    if (pointerValue !== null) {
      if (isRange) {
        commitRange(
          handle === "min" ? pointerValue : valueMin,
          handle === "max" ? pointerValue : valueMax,
        );
      } else {
        commitSingle(pointerValue);
      }
    }

    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.activeHandle || disabled) return;
    const pointerValue = valueFromPointer(event.clientX);
    if (pointerValue === null) return;

    if (isRange) {
      commitRange(
        dragState.activeHandle === "min" ? pointerValue : valueMin,
        dragState.activeHandle === "max" ? pointerValue : valueMax,
      );
    } else {
      commitSingle(pointerValue);
    }
  }

  function endDrag() {
    setDragState({ activeHandle: null });
  }

  const displayText = isRange
    ? `${formatValue ? formatValue(valueMin) : valueMin} — ${formatValue ? formatValue(valueMax) : valueMax}`
    : formatValue
      ? formatValue(value as number)
      : String(value);

  return (
    <div className={clsx(styles.wrapper, className)}>
      {(label || showValue) && (
        <div className={styles.labelRow}>
          <span>{label}</span>
          {showValue && <span className={styles.valueText}>{displayText}</span>}
        </div>
      )}

      <div
        ref={trackRef}
        className={clsx(styles.track, disabled && styles.disabled)}
        dir="ltr"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        <div
          className={styles.fill}
          style={{ left: `${percentMin}%`, width: `${percentMax - percentMin}%` }}
        />

        {isRange && (
          <div
            className={clsx(styles.thumb, dragState.activeHandle === "min" && styles.thumbActive)}
            style={{ left: `${percentMin}%` }}
          />
        )}

        <div
          className={clsx(styles.thumb, dragState.activeHandle === "max" && styles.thumbActive)}
          style={{ left: `${percentMax}%` }}
        />

        <input
          ref={ref}
          type="range"
          className={styles.input}
          min={min}
          max={max}
          step={step}
          value={valueMax}
          disabled={disabled}
          onChange={(e) => commitSingle(Number(e.target.value))}
          aria-label={label}
          tabIndex={isRange ? -1 : 0}
          {...rest}
        />
      </div>
    </div>
  );
}
