import type { HTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.css";
import { useAccordionContext } from "./AccordionContext";

export interface AccordionPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function AccordionPanel({
  value,
  children,
  className,
  ref,
  ...rest
}: AccordionPanelProps) {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.includes(value);

  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(styles.panel, isOpen && styles.panelOpen, className)}
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
