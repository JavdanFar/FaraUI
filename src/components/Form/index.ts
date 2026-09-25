import { Form as FormRoot } from "./Form";
import { FormField } from "./FormField";

export const Form = Object.assign(FormRoot, { Field: FormField });

export type { FormProps, FormHandle } from "./Form";
export type { FormFieldProps, FieldProps, FieldHelpers } from "./FormField";
export type { FormRule, FormRules } from "./formValidation";
