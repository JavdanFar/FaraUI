import type { ReactNode } from "react";
import styles from "./Accordion.module.css";

export interface AccordionItemProps {
  value: string;
  children: ReactNode;
}

export function AccordionItem({ value, children }: AccordionItemProps) {
  return (
    <div className={styles.item} data-fara-accordion-item data-accordion-value={value}>
      {children}
    </div>
  );
}
