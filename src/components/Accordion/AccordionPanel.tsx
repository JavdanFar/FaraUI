import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.css";
import { useAccordionContext } from "./AccordionContext";

export interface AccordionPanelProps {
  value: string;
  children: ReactNode;
}

export function AccordionPanel({ value, children }: AccordionPanelProps) {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.includes(value);

  return (
    <div
      className={clsx(styles.panel, isOpen && styles.panelOpen)}
      data-fara-accordion-panel
      data-open={isOpen || undefined}
    >
      <div className={styles.panelInner} data-fara-accordion-panel-inner>
        <div className={styles.panelContent} data-fara-accordion-panel-content>
          {children}
        </div>
      </div>
    </div>
  );
}
