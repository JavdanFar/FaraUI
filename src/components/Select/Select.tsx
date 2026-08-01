import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "انتخاب کنید...",
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(optionValue: string) {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  }

  return (
    <div ref={wrapperRef} className={clsx(styles.wrapper, className)}>
      <input
        className={styles.trigger}
        disabled={disabled}
        placeholder={placeholder}
        value={isOpen ? searchTerm : (selectedOption?.label ?? "")}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && (
        <div className={styles.dropdown}>
          {filteredOptions.length === 0 ? (
            <div className={styles.empty}>نتیجه‌ای یافت نشد</div>
          ) : (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                className={clsx(styles.option, opt.value === value && styles.optionSelected)}
                onMouseDown={() => handleSelect(opt.value)}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
