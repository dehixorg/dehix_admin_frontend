import { Control } from "react-hook-form";

// Define TypeScript interfaces for the JSON structure
export enum FormFieldType {
  INPUT,
  TEXTAREA,
  DATE,
  DROPDOWN,
  IMAGE,
  COMBOBOX,
  INPUT_OTP,
  SELECT,
  RADIO,
  CHECKBOX
}

export interface Field {
  type: FormFieldType;
  name: string;
  label: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>; // Options for some form fields like combobox, select, etc..
  editable?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  className?: string;
  description?: string;
  otpLength?: number;
}

export interface FormFieldProps extends Field {
  control: Control<Record<string, any>>;
}

export interface FormData {
  editable: boolean;
  title: string;
  subtitle: string;
  numberOfColumns: number;
  fields: Field[];
  defaultValues?: Record<string, any>;
}
