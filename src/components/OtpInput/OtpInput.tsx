import type { ClipboardEvent, HTMLAttributes, KeyboardEvent, Ref } from "react";
import { useRef, useState } from "react";
import clsx from "clsx";
import styles from "./OtpInput.module.css";

export interface OtpInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  ref?: Ref<HTMLDivElement>;
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
  defaultValue = "",
  onChange,
  onComplete,
  disabled = false,
  error = false,
  className,
  ref,
  ...rest
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? (value ?? "") : internalValue;

  const [digits, setDigits] = useState<string[]>(() => toDigitsArray(currentValue, length));
  const [prevValue, setPrevValue] = useState(currentValue);
  const [prevLength, setPrevLength] = useState(length);

  if (length !== prevLength) {
    setPrevLength(length);
    setDigits(toDigitsArray(digits.join(""), length));
  }

  if (isControlled && currentValue !== prevValue) {
    setPrevValue(currentValue);
    if (currentValue !== digits.join("")) setDigits(toDigitsArray(currentValue, length));
  }

  const isComplete = !digits.includes("");

  function commit(nextDigits: string[]) {
    setDigits(nextDigits);
    const nextValue = nextDigits.join("");
    if (!isControlled) setInternalValue(nextValue);
    onChange?.(nextValue);

    if (!nextDigits.includes("")) {
      onComplete?.(nextValue);
      inputRefs.current.forEach((input) => input?.blur());
    }
  }

  function setDigitAt(index: number, char: string) {
    const next = [...digits];
    next[index] = char;
    commit(next);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleChange(index: number, rawValue: string) {
    const normalized = normalizeDigit(rawValue.slice(-1));
    setDigitAt(index, /\d/.test(normalized) ? normalized : "");
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();

      if (digits[index]) {
        setDigitAt(index, "");
        return;
      }

      if (index > 0) {
        const previousIndex = index - 1;
        const next = [...digits];
        next[previousIndex] = "";
        commit(next);
        inputRefs.current[previousIndex]?.focus();
      }
      return;
    }

    const typed = normalizeDigit(e.key);
    if (/\d/.test(typed) && digits[index]) {
      e.preventDefault();
      setDigitAt(index, typed);
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
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
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
      {...rest}
      ref={ref}
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
