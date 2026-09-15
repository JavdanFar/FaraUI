import { Form as FormRoot } from "./Form";
import { FormField } from "./FormField";

export const Form = Object.assign(FormRoot, { Field: FormField });

export type { FormProps } from "./Form";
export type { FormFieldProps, FieldProps } from "./FormField";
export type { FormRule, FormRules } from "./formValidation";
