"use client";

import type { InputHTMLAttributes, Ref } from "react";
import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./Combobox.module.css";
import { Chip } from "../Chip";
import { AnchoredPopup } from "../AnchoredPopup";
import { nextActiveIndex } from "../../utils/nextActiveIndex";
import { normalizePersianText } from "../../utils/normalizePersianText";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "size" | "defaultValue"
> {
  options: ComboboxOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  emptyMessage?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Combobox({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "انتخاب کنید...",
  disabled = false,
  emptyMessage = "نتیجه‌ای یافت نشد",
  className,
  name,
  ref,
  onBlur,
  onFocus,
  onKeyDown,
  ...rest
}: ComboboxProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string[] | undefined>(defaultValue);
  const currentValue = isControlled ? value : (internalValue ?? []);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedOptions = options.filter((opt) => currentValue.includes(opt.value));
  const filteredOptions = options.filter(
    (opt) =>
      !currentValue.includes(opt.value) &&
      normalizePersianText(opt.label).includes(normalizePersianText(searchTerm)),
  );
  const allSelected = options.length > 0 && selectedOptions.length === options.length;

  const activeOption = activeIndex >= 0 ? filteredOptions[activeIndex] : undefined;

  function openDropdown() {
    if (disabled) return;
    setIsOpen(true);
    setActiveIndex(filteredOptions.length > 0 ? 0 : -1);
  }

  function commit(next: string[]) {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  function selectOption(optionValue: string) {
    commit([...currentValue, optionValue]);
    setSearchTerm("");
    setActiveIndex(0);
  }

  function removeOption(optionValue: string) {
    commit(currentValue.filter((v) => v !== optionValue));
  }

  function handleTriggerClick() {
    if (!disabled) setIsOpen(true);
  }

  function closeDropdown() {
    setIsOpen(false);
    setSearchTerm("");
    setActiveIndex(-1);
  }

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const node = listRef.current?.children[activeIndex];
    if (node instanceof HTMLElement) node.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!isOpen) {
          openDropdown();
          return;
        }
        if (filteredOptions.length === 0) return;
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((prev) => nextActiveIndex(prev, step, filteredOptions.length));
        return;
      }
      case "Home":
        if (!isOpen) return;
        event.preventDefault();
        setActiveIndex(0);
        return;
      case "End":
        if (!isOpen) return;
        event.preventDefault();
        setActiveIndex(filteredOptions.length - 1);
        return;
      case "Enter":
        event.preventDefault();
        if (!activeOption) return;
        selectOption(activeOption.value);
        return;
      case "Backspace":
        if (searchTerm === "" && selectedOptions.length > 0) {
          removeOption(selectedOptions[selectedOptions.length - 1].value);
        }
        return;
      default:
        return;
    }
  }

  return (
    <div data-fara-combobox className={clsx(styles.wrapper, className)}>
      {name !== undefined &&
        currentValue.map((selectedValue, index) => (
          <input
            key={`${selectedValue}-${index}`}
            type="hidden"
            name={name}
            value={selectedValue}
            disabled={disabled}
            data-fara-combobox-value
          />
        ))}
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
          ref={ref}
          id={listId}
          className={clsx(styles.searchInput, allSelected && styles.searchInputCollapsed)}
          data-fara-combobox-search-input
          role="combobox"
          aria-expanded={isOpen && !disabled}
          aria-controls={`${listId}-listbox`}
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen && activeOption ? `${listId}-option-${activeIndex}` : undefined
          }
          disabled={disabled}
          placeholder={selectedOptions.length === 0 ? placeholder : ""}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setActiveIndex(0);
          }}
          onFocus={(event) => {
            openDropdown();
            onFocus?.(event);
          }}
          onBlur={onBlur}
          onKeyDown={(event) => {
            handleKeyDown(event);
            onKeyDown?.(event);
          }}
          {...rest}
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
        <div ref={listRef} id={`${listId}-listbox`} role="listbox" data-fara-combobox-option-list>
          {filteredOptions.length === 0 ? (
            <div className={styles.empty} data-fara-combobox-empty>
              {emptyMessage}
            </div>
          ) : (
            filteredOptions.map((opt, index) => (
              <div
                key={opt.value}
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={false}
                data-fara-combobox-option
                data-active={index === activeIndex || undefined}
                className={clsx(styles.option, index === activeIndex && styles.optionActive)}
                onMouseEnter={() => setActiveIndex(index)}
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
