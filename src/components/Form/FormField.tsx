import type { ReactNode } from "react";
import { useId } from "react";
import { useFormContext } from "./FormContext";

interface ValueFieldProps<TValue> {
  value?: TValue;
  onChange: (event: unknown) => void;
  onBlur: () => void;
  ref: (element: HTMLElement | null) => void;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
}

interface BooleanFieldProps {
  checked?: boolean;
  onChange: (event: unknown) => void;
  onBlur: () => void;
  ref: (element: HTMLElement | null) => void;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
}

export type FieldProps<TValue = string> = TValue extends boolean
  ? BooleanFieldProps
  : ValueFieldProps<TValue>;

export interface FieldHelpers {
  errorId: string;
}

export interface FormFieldProps<TValue = string> {
  name: string;
  children: (
    props: FieldProps<TValue>,
    error: string | undefined,
    helpers: FieldHelpers,
  ) => ReactNode;
}

function toValue(event: unknown) {
  if (typeof event === "object" && event !== null && "target" in event) {
    const target = (event as { target: EventTarget | null }).target as HTMLInputElement;
    if (target.type === "checkbox" || target.type === "radio") return target.checked;
    return target.value;
  }
  return event;
}

export function FormField<TValue = string>({ name, children }: FormFieldProps<TValue>) {
  const { values, errors, touched, setValue, blurField, registerField } = useFormContext();
  const errorId = `${useId()}-error`;

  const fieldValue = values[name];
  const error = touched[name] ? errors[name] : undefined;

  const fieldProps = {
    ...(typeof fieldValue === "boolean" ? { checked: fieldValue } : { value: fieldValue }),
    onChange: (event: unknown) => setValue(name, toValue(event)),
    onBlur: () => blurField(name),
    ref: (element: HTMLElement | null) => registerField(name, element),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  } as FieldProps<TValue>;

  return children(fieldProps, error, { errorId });
}
