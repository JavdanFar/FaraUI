import type { ReactNode } from "react";
import { useState } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.css";
import { AccordionContext } from "./AccordionContext";

export interface AccordionRootProps {
  children: ReactNode;
  className?: string;
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

export function AccordionRoot({
  children,
  className,
  allowMultiple = false,
  defaultOpen = [],
}: AccordionRootProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  function toggleItem(value: string) {
    setOpenItems((prev) => {
      const isOpen = prev.includes(value);

      if (allowMultiple) {
        return isOpen ? prev.filter((v) => v !== value) : [...prev, value];
      }

      return isOpen ? [] : [value];
    });
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div data-fara-accordion className={clsx(styles.root, className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}
