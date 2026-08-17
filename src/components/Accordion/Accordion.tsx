import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.css";

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion.Item, Trigger, and Panel must be used inside Accordion.Root");
  }
  return context;
}

export interface AccordionRootProps {
  children: ReactNode;
  className?: string;
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

function Root({
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
      <div className={clsx(styles.root, className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  value: string;
  children: ReactNode;
}

function Item({ value, children }: AccordionItemProps) {
  return (
    <div className={styles.item} data-accordion-value={value}>
      {children}
    </div>
  );
}

export interface AccordionTriggerProps {
  value: string;
  children: ReactNode;
}

function Trigger({ value, children }: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordionContext();
  const isOpen = openItems.includes(value);

  return (
    <button
      type="button"
      className={styles.trigger}
      onClick={() => toggleItem(value)}
      aria-expanded={isOpen}
    >
      {children}
      <svg
        className={clsx(styles.icon, isOpen && styles.iconOpen)}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

export interface AccordionPanelProps {
  value: string;
  children: ReactNode;
}

function Panel({ value, children }: AccordionPanelProps) {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.includes(value);

  return (
    <div className={clsx(styles.panel, isOpen && styles.panelOpen)}>
      <div className={styles.panelInner}>
        <div className={styles.panelContent}>{children}</div>
      </div>
    </div>
  );
}

export const Accordion = { Root, Item, Trigger, Panel };
