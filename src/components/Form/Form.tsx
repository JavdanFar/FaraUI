import type { FormEvent, ReactNode, Ref } from "react";
import { useImperativeHandle, useRef, useState } from "react";
import { FormContext } from "./FormContext";
import type { FormRule, FormRules } from "./formValidation";
import { validateFieldValue } from "./formValidation";

export interface FormHandle<T> {
  getValues: () => T;
  getErrors: () => Record<string, string | undefined>;
  setValue: (name: string, value: unknown) => void;
  setValues: (values: Partial<T>) => void;
  reset: (values?: T) => void;
}

export interface FormProps<T extends Record<string, unknown>> {
  initialValues: T;
  rules?: FormRules<T>;
  onSubmit: (values: T) => void;
  children: ReactNode;
  className?: string;
  ref?: Ref<FormHandle<T>>;
}

export function Form<T extends Record<string, unknown>>({
  initialValues,
  rules = {},
  onSubmit,
  children,
  className,
  ref,
}: FormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fieldRefs = useRef(new Map<string, HTMLElement>());

  const valuesRecord: Record<string, unknown> = values;
  const rulesRecord = rules as unknown as Record<string, FormRule | undefined>;
  const ruleKeys = Object.keys(rulesRecord);

  function setValue(name: string, value: unknown) {
    const nextValues = { ...values, [name]: value } as T;
    setValues(nextValues);

    let hasTouchedField = false;
    const nextErrors = { ...errors };
    for (const key of ruleKeys) {
      if (touched[key]) {
        hasTouchedField = true;
        nextErrors[key] = validateFieldValue(nextValues[key], rulesRecord[key], nextValues);
      }
    }
    if (hasTouchedField) setErrors(nextErrors);
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

    const nextErrors: Record<string, string | undefined> = {};
    for (const name of ruleKeys) {
      nextErrors[name] = validateFieldValue(valuesRecord[name], rulesRecord[name], valuesRecord);
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

  useImperativeHandle(ref, () => ({
    getValues: () => values,
    getErrors: () => errors,
    setValue,
    setValues: (next: Partial<T>) => {
      setValues((prev) => ({ ...prev, ...next }) as T);
      setErrors((prev) => {
        const nextErrors = { ...prev };
        for (const key of Object.keys(next)) delete nextErrors[key];
        return nextErrors;
      });
    },
    reset: (next?: T) => {
      setValues(next ?? initialValues);
      setErrors({});
      setTouched({});
    },
  }));

  return (
    <FormContext.Provider
      value={{ values: valuesRecord, errors, touched, setValue, blurField, registerField }}
    >
      <form className={className} data-fara-form onSubmit={handleSubmit} noValidate>
        {children}
      </form>
    </FormContext.Provider>
  );
}
