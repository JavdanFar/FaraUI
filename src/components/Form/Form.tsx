import type { FormEvent, ReactNode } from "react";
import { useRef, useState } from "react";
import { FormContext } from "./FormContext";
import type { FormRule, FormRules } from "./formValidation";
import { validateFieldValue } from "./formValidation";

export interface FormProps<T extends Record<string, unknown>> {
  initialValues: T;
  rules?: FormRules<T>;
  onSubmit: (values: T) => void;
  children: ReactNode;
  className?: string;
}

export function Form<T extends Record<string, unknown>>({
  initialValues,
  rules = {},
  onSubmit,
  children,
  className,
}: FormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fieldRefs = useRef(new Map<string, HTMLElement>());

  const valuesRecord: Record<string, unknown> = values;
  const rulesRecord = rules as unknown as Record<string, FormRule | undefined>;

  function setValue(name: string, value: unknown) {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateFieldValue(value, rulesRecord[name], nextValues),
      }));
    }
  }

  function blurField(name: string) {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateFieldValue(valuesRecord[name], rulesRecord[name], valuesRecord),
    }));
  }

  function registerField(name: string, element: HTMLElement | null) {
    if (element) fieldRefs.current.set(name, element);
    else fieldRefs.current.delete(name);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const ruleKeys = Object.keys(rulesRecord);
    const nextErrors: Record<string, string | undefined> = {};
    for (const name of ruleKeys) {
      nextErrors[name] = validateFieldValue(
        valuesRecord[name],
        rulesRecord[name],
        valuesRecord,
      );
    }

    setErrors(nextErrors);
    setTouched(Object.fromEntries(ruleKeys.map((name) => [name, true])));

    const firstInvalid = ruleKeys.find((name) => nextErrors[name]);
    if (firstInvalid) {
      fieldRefs.current.get(firstInvalid)?.focus();
      return;
    }

    onSubmit(values);
  }

  return (
    <FormContext.Provider value={{ values: valuesRecord, errors, touched, setValue, blurField, registerField }}>
      <form className={className} data-fara-form onSubmit={handleSubmit} noValidate>
        {children}
      </form>
    </FormContext.Provider>
  );
}
