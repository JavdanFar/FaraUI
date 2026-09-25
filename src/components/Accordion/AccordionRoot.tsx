import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useState } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.css";
import { AccordionContext } from "./AccordionContext";
import { nextActiveIndex } from "../../utils/nextActiveIndex";

export interface AccordionRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  allowMultiple?: boolean;
  defaultOpen?: string[];
  open?: string[];
  onOpenChange?: (open: string[]) => void;
  ref?: Ref<HTMLDivElement>;
}

export function AccordionRoot({
  children,
  className,
  allowMultiple = false,
  defaultOpen = [],
  open,
  onOpenChange,
  ref,
  onKeyDown,
  ...rest
}: AccordionRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState<string[]>(() =>
    allowMultiple ? defaultOpen : defaultOpen.slice(0, 1),
  );

  const isControlled = open !== undefined;
  const openItems = isControlled ? open : uncontrolledOpen;

  function commit(next: string[]) {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  function toggleItem(value: string) {
    const isOpen = openItems.includes(value);

    if (allowMultiple) {
      commit(isOpen ? openItems.filter((item) => item !== value) : [...openItems, value]);
      return;
    }

    commit(isOpen ? [] : [value]);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const triggers = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        "[data-fara-accordion-trigger]:not(:disabled)",
      ),
    );
    const current = triggers.indexOf(event.target as HTMLButtonElement);
    if (current === -1) {
      onKeyDown?.(event);
      return;
    }

    let next: number;
    switch (event.key) {
      case "ArrowDown":
        next = nextActiveIndex(current, 1, triggers.length);
        break;
      case "ArrowUp":
        next = nextActiveIndex(current, -1, triggers.length);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = triggers.length - 1;
        break;
      default:
        onKeyDown?.(event);
        return;
    }

    event.preventDefault();
    triggers[next].focus();
    onKeyDown?.(event);
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div
        {...rest}
        ref={ref}
        className={clsx(styles.root, className)}
        data-fara-accordion
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}
