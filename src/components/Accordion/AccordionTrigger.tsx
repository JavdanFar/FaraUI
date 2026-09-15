import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.css";
import { useAccordionContext } from "./AccordionContext";

export interface AccordionTriggerProps {
  value: string;
  children: ReactNode;
}

export function AccordionTrigger({ value, children }: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordionContext();
  const isOpen = openItems.includes(value);

  return (
    <button
      type="button"
      className={styles.trigger}
      data-fara-accordion-trigger
      data-open={isOpen || undefined}
      onClick={() => toggleItem(value)}
      aria-expanded={isOpen}
    >
      {children}
      <svg
        className={clsx(styles.icon, isOpen && styles.iconOpen)}
        data-fara-accordion-icon
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
