"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { InputHTMLAttributes, Ref } from "react";
import clsx from "clsx";
import styles from "./Select.module.css";
import { AnchoredPopup } from "../AnchoredPopup";
import { nextActiveIndex } from "../../utils/nextActiveIndex";
import { normalizePersianText } from "../../utils/normalizePersianText";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "size" | "defaultValue"> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  emptyMessage?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Select({
  options,
  value,
  defaultValue = "",
  onChange,
  placeholder = "انتخاب کنید...",
  disabled = false,
  emptyMessage = "نتیجه‌ای یافت نشد",
  className,
  name,
  ref,
  onFocus,
  onKeyDown,
  ...rest
}: SelectProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  function setTriggerRef(element: HTMLInputElement | null) {
    inputRef.current = element;
    if (typeof ref === "function") ref(element);
    else if (ref) ref.current = element;
  }

  const selectedOption = options.find((opt) => opt.value === currentValue);

  const filteredOptions = options.filter((opt) =>
    normalizePersianText(opt.label).includes(normalizePersianText(searchTerm)),
  );

  const activeOption = activeIndex >= 0 ? filteredOptions[activeIndex] : undefined;

  function openDropdown() {
    if (disabled) return;
    setIsOpen(true);
    setActiveIndex(filteredOptions.length > 0 ? 0 : -1);
  }

  function closeDropdown() {
    setIsOpen(false);
    setSearchTerm("");
    setActiveIndex(-1);
  }

  function handleSelect(optionValue: string) {
    if (!isControlled) setInternalValue(optionValue);
    onChange?.(optionValue);
    closeDropdown();
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
        handleSelect(activeOption.value);
        return;
      default:
        return;
    }
  }

  return (
    <div data-fara-select className={clsx(styles.wrapper, className)}>
      {name !== undefined && (
        <input
          type="hidden"
          name={name}
          value={currentValue}
          disabled={disabled}
          data-fara-select-value
        />
      )}
      <input
        ref={setTriggerRef}
        className={styles.trigger}
        data-fara-select-trigger
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          isOpen && activeOption ? `${listId}-option-${activeIndex}` : undefined
        }
        disabled={disabled}
        placeholder={placeholder}
        value={isOpen ? searchTerm : (selectedOption?.label ?? "")}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setIsOpen(true);
          setActiveIndex(0);
        }}
        onFocus={(event) => {
          openDropdown();
          onFocus?.(event);
        }}
        onKeyDown={(event) => {
          handleKeyDown(event);
          onKeyDown?.(event);
        }}
        {...rest}
      />

      <AnchoredPopup
        open={isOpen && !disabled}
        anchorRef={inputRef}
        onClose={closeDropdown}
        className={styles.dropdown}
        matchAnchorWidth
        dataFara="select-dropdown"
      >
        <div ref={listRef} id={listId} role="listbox" data-fara-select-option-list>
          {filteredOptions.length === 0 ? (
            <div className={styles.empty} data-fara-select-empty>{emptyMessage}</div>
          ) : (
            filteredOptions.map((opt, index) => (
              <div
                key={opt.value}
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={opt.value === currentValue}
                data-fara-select-option
                data-selected={opt.value === currentValue || undefined}
                data-active={index === activeIndex || undefined}
                className={clsx(
                  styles.option,
                  opt.value === currentValue && styles.optionSelected,
                  index === activeIndex && styles.optionActive,
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelect(opt.value);
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
