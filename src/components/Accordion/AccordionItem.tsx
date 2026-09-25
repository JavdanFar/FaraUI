import type { HTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.css";
import { useAccordionContext } from "./AccordionContext";

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function AccordionItem({
  value,
  children,
  className,
  ref,
  ...rest
}: AccordionItemProps) {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.includes(value);

  return (
    <div
      {...rest}
      ref={ref}
      className={clsx(styles.item, className)}
      data-fara-accordion-item
      data-accordion-value={value}
      data-open={isOpen || undefined}
    >
      {children}
    </div>
  );
}
