import type { HTMLAttributes, KeyboardEvent, Ref } from "react";
import { useRef, useState } from "react";
import clsx from "clsx";
import styles from "./Rating.module.css";

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function Rating({
  value = 0,
  onChange,
  max = 5,
  readOnly = false,
  className,
  "aria-label": ariaLabel = "امتیاز",
  onBlur,
  onKeyDown,
  ref,
  ...rest
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [focusedValue, setFocusedValue] = useState<number | null>(null);
  const starRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const displayValue = hoverValue ?? value;
  const starValues = Array.from({ length: max }, (_, i) => i + 1);

  const selectedValue = value >= 1 && value <= max ? value : 1;
  const tabbableValue = focusedValue ?? selectedValue;

  function moveFocus(target: number) {
    const next = Math.min(Math.max(1, target), max);
    setFocusedValue(next);
    starRefs.current[next - 1]?.focus();
    if (!readOnly) onChange?.(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = focusedValue ?? selectedValue;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();
        moveFocus(current + 1);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();
        moveFocus(current - 1);
        break;
      case "Home":
        event.preventDefault();
        moveFocus(1);
        break;
      case "End":
        event.preventDefault();
        moveFocus(max);
        break;
      default:
        break;
    }
  }

  return (
    <div
      ref={ref}
      data-fara-rating
      data-read-only={readOnly || undefined}
      className={clsx(styles.wrapper, className)}
      role="radiogroup"
      aria-label={ariaLabel}
      tabIndex={-1}
      aria-readonly={readOnly || undefined}
      aria-disabled={readOnly || undefined}
      onKeyDown={(event) => {
        handleKeyDown(event);
        onKeyDown?.(event);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusedValue(null);
        }
        onBlur?.(event);
      }}
      {...rest}
    >
      {starValues.map((starValue) => (
        <button
          key={starValue}
          ref={(node) => {
            starRefs.current[starValue - 1] = node;
          }}
          type="button"
          tabIndex={starValue === tabbableValue ? 0 : -1}
          aria-disabled={readOnly || undefined}
          data-fara-rating-star
          data-filled={starValue <= displayValue || undefined}
          className={clsx(styles.star, starValue <= displayValue && styles.starFilled)}
          onClick={() => {
            if (!readOnly) onChange?.(starValue);
          }}
          onFocus={() => setFocusedValue(starValue)}
          onMouseEnter={() => {
            if (!readOnly) setHoverValue(starValue);
          }}
          onMouseLeave={() => {
            if (!readOnly) setHoverValue(null);
          }}
          role="radio"
          aria-checked={starValue === value}
          aria-label={`${starValue} از ${max} ستاره`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}
