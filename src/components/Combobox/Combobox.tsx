import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./Combobox.module.css";
import { Chip } from "../Chip";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "انتخاب کنید...",
  disabled = false,
  emptyMessage = "نتیجه‌ای یافت نشد",
  className,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  const selectedOptions = options.filter((opt) => value.includes(opt.value));
  const filteredOptions = options.filter(
    (opt) =>
      !value.includes(opt.value) &&
      opt.label.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const path = event.composedPath();
      if (wrapperRef.current && !path.includes(wrapperRef.current)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function selectOption(optionValue: string) {
    onChange([...value, optionValue]);
    setSearchTerm("");
  }

  function removeOption(optionValue: string) {
    onChange(value.filter((v) => v !== optionValue));
  }

  function handleTriggerClick() {
    if (!disabled) setIsOpen(true);
  }

  function handleBackspace(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && searchTerm === "" && selectedOptions.length > 0) {
      removeOption(selectedOptions[selectedOptions.length - 1].value);
    }
  }

  return (
    <div ref={wrapperRef} className={clsx(styles.wrapper, className)}>
      <div
        className={clsx(styles.trigger, disabled && styles.triggerDisabled)}
        onClick={handleTriggerClick}
      >
        {selectedOptions.map((opt) => (
          <Chip key={opt.value} onRemove={disabled ? undefined : () => removeOption(opt.value)}>
            {opt.label}
          </Chip>
        ))}

        <input
          id={inputId}
          className={styles.searchInput}
          disabled={disabled}
          placeholder={selectedOptions.length === 0 ? placeholder : ""}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleBackspace}
        />
      </div>

      {isOpen && !disabled && (
        <div className={styles.dropdown} role="listbox">
          {filteredOptions.length === 0 ? (
            <div className={styles.empty}>{emptyMessage}</div>
          ) : (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                role="option"
                aria-selected={false}
                className={styles.option}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectOption(opt.value);
                }}
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
