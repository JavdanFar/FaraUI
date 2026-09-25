import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.css";
import { useAccordionContext } from "./AccordionContext";

export interface AccordionTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

export function AccordionTrigger({
  value,
  children,
  className,
  ref,
  onClick,
  ...rest
}: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordionContext();
  const isOpen = openItems.includes(value);

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      className={clsx(styles.trigger, className)}
      data-fara-accordion-trigger
      data-open={isOpen || undefined}
      onClick={(event) => {
        toggleItem(value);
        onClick?.(event);
      }}
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
