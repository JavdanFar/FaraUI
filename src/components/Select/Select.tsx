import { useState, useRef } from "react";
import type { Ref } from "react";
import clsx from "clsx";
import styles from "./Select.module.css";
import { AnchoredPopup } from "../AnchoredPopup";

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
  ref?: Ref<HTMLInputElement>;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "انتخاب کنید...",
  disabled = false,
  className,
  ref,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function setTriggerRef(element: HTMLInputElement | null) {
    inputRef.current = element;
    if (typeof ref === "function") ref(element);
    else if (ref) ref.current = element;
  }

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleSelect(optionValue: string) {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  }

  function closeDropdown() {
    setIsOpen(false);
    setSearchTerm("");
  }

  return (
    <div data-fara-select className={clsx(styles.wrapper, className)}>
      <input
        ref={setTriggerRef}
        className={styles.trigger}
        data-fara-select-trigger
        disabled={disabled}
        placeholder={placeholder}
        value={isOpen ? searchTerm : (selectedOption?.label ?? "")}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />

      <AnchoredPopup
        open={isOpen}
        anchorRef={inputRef}
        onClose={closeDropdown}
        className={styles.dropdown}
        matchAnchorWidth
        dataFara="select-dropdown"
      >
        {filteredOptions.length === 0 ? (
          <div className={styles.empty} data-fara-select-empty>نتیجه‌ای یافت نشد</div>
        ) : (
          filteredOptions.map((opt) => (
            <div
              key={opt.value}
              data-fara-select-option
              data-selected={opt.value === value || undefined}
              className={clsx(styles.option, opt.value === value && styles.optionSelected)}
              onMouseDown={() => handleSelect(opt.value)}
            >
              {opt.label}
            </div>
          ))
        )}
      </AnchoredPopup>
    </div>
  );
}
