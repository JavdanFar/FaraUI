import { useId, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./Combobox.module.css";
import { Chip } from "../Chip";
import { AnchoredPopup } from "../AnchoredPopup";

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
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  const selectedOptions = options.filter((opt) => value.includes(opt.value));
  const filteredOptions = options.filter(
    (opt) =>
      !value.includes(opt.value) &&
      opt.label.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

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

  function closeDropdown() {
    setIsOpen(false);
    setSearchTerm("");
  }

  function handleBackspace(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && searchTerm === "" && selectedOptions.length > 0) {
      removeOption(selectedOptions[selectedOptions.length - 1].value);
    }
  }

  return (
    <div data-fara-combobox className={clsx(styles.wrapper, className)}>
      <div
        ref={triggerRef}
        data-fara-combobox-trigger
        data-disabled={disabled || undefined}
        className={clsx(styles.trigger, disabled && styles.triggerDisabled)}
        onClick={handleTriggerClick}
      >
        {selectedOptions.map((opt) => (
          <Chip
            key={opt.value}
            data-fara-combobox-chip
            onRemove={disabled ? undefined : () => removeOption(opt.value)}
          >
            {opt.label}
          </Chip>
        ))}

        <input
          id={inputId}
          className={styles.searchInput}
          data-fara-combobox-search-input
          disabled={disabled}
          placeholder={selectedOptions.length === 0 ? placeholder : ""}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleBackspace}
        />
      </div>

      <AnchoredPopup
        open={isOpen && !disabled}
        anchorRef={triggerRef}
        onClose={closeDropdown}
        className={styles.dropdown}
        matchAnchorWidth
        dataFara="combobox-dropdown"
      >
        <div role="listbox" data-fara-combobox-option-list>
          {filteredOptions.length === 0 ? (
            <div className={styles.empty} data-fara-combobox-empty>{emptyMessage}</div>
          ) : (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                role="option"
                aria-selected={false}
                data-fara-combobox-option
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
      </AnchoredPopup>
    </div>
  );
}
