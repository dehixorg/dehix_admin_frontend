import { Control, UseControllerProps } from "react-hook-form";

// Define TypeScript interfaces for the JSON structure
export enum FormFieldType {
  INPUT,
  TEXTAREA,
  DATE,
  DROPDOWN,
  IMAGE,
}

export interface Field {
  type: FormFieldType;
  name: string;
  label: string;
  required?: boolean;
  data?: any;
  options?: Array<{ name: string; value: string }>;
  editable?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  className?: string;
  description?: string;
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
