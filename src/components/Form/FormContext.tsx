import { createContext, useContext } from "react";

export interface FormContextValue {
  values: Record<string, unknown>;
  errors: Record<string, string | undefined>;
  touched: Record<string, boolean>;
  setValue: (name: string, value: unknown) => void;
  blurField: (name: string) => void;
  registerField: (name: string, element: HTMLElement | null) => void;
}

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("Form.Field must be used inside Form");
  }
  return context;
}
