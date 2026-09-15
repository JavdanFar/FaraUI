import { createContext, useContext } from "react";

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion.Item, Trigger, and Panel must be used inside Accordion.Root");
  }
  return context;
}
