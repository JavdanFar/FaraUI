import { useRef, useState } from "react";
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

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function normalizeDigit(char: string): string {
  const persianIndex = PERSIAN_DIGITS.indexOf(char);
  if (persianIndex !== -1) return String(persianIndex);
  const arabicIndex = ARABIC_DIGITS.indexOf(char);
  if (arabicIndex !== -1) return String(arabicIndex);
  return char;
}

function toDigitsArray(raw: string, length: number): string[] {
  const digits = raw
    .split("")
    .map(normalizeDigit)
    .filter((char) => /\d/.test(char))
    .slice(0, length);
  while (digits.length < length) {
    digits.push("");
  }
  return digits;
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
  const [digits, setDigits] = useState<string[]>(() => toDigitsArray(value, length));
  const [prevValue, setPrevValue] = useState(value);
  const isComplete = !digits.includes("");

  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== digits.join("")) {
      setDigits(toDigitsArray(value, length));
    }
  }

  function commit(nextDigits: string[]) {
    setDigits(nextDigits);
    const nextValue = nextDigits.join("");
    onChange(nextValue);

    if (!nextDigits.includes("")) {
      onComplete?.(nextValue);
      inputRefs.current.forEach((input) => input?.blur());
    }
  }

  function handleChange(index: number, rawValue: string) {
    const normalized = normalizeDigit(rawValue.slice(-1));
    const char = /\d/.test(normalized) ? normalized : "";
    const next = [...digits];
    next[index] = char;
    commit(next);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        e.preventDefault();
        const next = [...digits];
        next[index] = "";
        commit(next);
        return;
      }

      if (index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      return;
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      return;
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pastedDigits = toDigitsArray(e.clipboardData.getData("text"), length);
    commit(pastedDigits);

    const firstEmpty = pastedDigits.indexOf("");
    if (firstEmpty === -1) {
      inputRefs.current[length - 1]?.focus();
    } else {
      inputRefs.current[firstEmpty]?.focus();
    }
  }

  return (
    <div
      data-fara-otp-input
      data-complete={isComplete || undefined}
      className={clsx(styles.wrapper, className)}
      dir="ltr"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          data-fara-otp-input-slot
          data-filled={digit !== "" || undefined}
          data-error={error || undefined}
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
