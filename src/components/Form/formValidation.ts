export interface FormRule<TValue = unknown> {
  required?: string;
  minLength?: [number, string];
  maxLength?: [number, string];
  pattern?: [RegExp, string];
  min?: [number, string];
  max?: [number, string];
  validate?: (value: TValue, values: Record<string, unknown>) => string | undefined;
}

export type FormRules<T> = {
  [K in keyof T]?: FormRule<T[K]>;
};

function isEmpty(value: unknown) {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "boolean") return !value;
  return false;
}

export function validateFieldValue(
  value: unknown,
  rule: FormRule | undefined,
  values: Record<string, unknown>,
): string | undefined {
  if (!rule) return undefined;

  if (rule.required !== undefined && isEmpty(value)) {
    return rule.required;
  }

  if (typeof value === "string") {
    if (rule.minLength && value.trim().length < rule.minLength[0]) return rule.minLength[1];
    if (rule.maxLength && value.length > rule.maxLength[0]) return rule.maxLength[1];
    if (rule.pattern && !rule.pattern[0].test(value)) return rule.pattern[1];
  }

  if (typeof value === "number") {
    if (rule.min && value < rule.min[0]) return rule.min[1];
    if (rule.max && value > rule.max[0]) return rule.max[1];
  }

  if (rule.validate) {
    return rule.validate(value, values);
  }

  return undefined;
}
