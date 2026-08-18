import { useState } from "react";
import clsx from "clsx";
import styles from "./Rating.module.css";

export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  className?: string;
}

export function Rating({ value, onChange, max = 5, readOnly = false, className }: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  return (
    <div className={clsx(styles.wrapper, className)} role="radiogroup" aria-label="امتیاز">
      {Array.from({ length: max }, (_, i) => i + 1).map((starValue) => (
        <button
          key={starValue}
          type="button"
          disabled={readOnly}
          className={clsx(styles.star, starValue <= displayValue && styles.starFilled)}
          onClick={() => onChange?.(starValue)}
          onMouseEnter={() => !readOnly && setHoverValue(starValue)}
          onMouseLeave={() => !readOnly && setHoverValue(null)}
          role="radio"
          aria-checked={starValue === value}
          aria-label={`${starValue} از ${max} ستاره`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}
