import { useRef } from "react";
import clsx from "clsx";
import styles from "./OtpInput.module.css";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function OtpInput({
  length = 4,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  className,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = value.split("").slice(0, length);
  while (digits.length < length) {
    digits.push("");
  }

  function updateValue(index: number, char: string) {
    const nextDigits = [...digits];
    nextDigits[index] = char;
    const nextValue = nextDigits.join("");
    onChange(nextValue);

    if (nextValue.length === length && !nextValue.includes("")) {
      onComplete?.(nextValue);
    }
  }

  function handleChange(index: number, rawValue: string) {
    const char = rawValue.replace(/\D/g, "").slice(-1);
    updateValue(index, char);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted.padEnd(length, ""));

    if (pasted.length === length) {
      onComplete?.(pasted);
      inputRefs.current[length - 1]?.focus();
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  }

  return (
    <div className={clsx(styles.wrapper, className)} dir="ltr">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className={clsx(styles.digit, error && styles.digitError)}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          aria-label={`رقم ${index + 1} از ${length}`}
        />
      ))}
    </div>
  );
}
