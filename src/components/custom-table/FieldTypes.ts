import React from "react";

export enum FilterDataType {
  SINGLE = "Single",
  MULTI = "Multi",
  CALENDER = "Calendar",
}

export enum FieldType {
  TEXT = "Text",
  LINK = "Link",
  CURRENCY = "Currency",
  CRYPTO = "Crypto",
  DATE = "Date",
  DATETIME = "DateTime",
  ACTION = "Action",
  ARRAY_VALUE = "ArrayValue",
  STATUS = "Status",
  TOGGLE = "Toggle",
  DELETE = "Delete",
}

export interface Actions {
  icon?: React.ReactNode,
  options: Array<{
    actionName: string,
    actionIcon: React.JSX.Element,
    type: "Button" | "Link",
    href?: string,
    handler?: (id: string) => void,
    className?: string
  }>
}

export interface Field {
  fieldName?: string; // name of the key for the field in the api response
  textValue: string; // text to be displayed in the table header
  type: FieldType; // type of the field
  sortable?: boolean;
  width?: number;
  formating?: object;
  link?: string; // the placeholder link to be displayed if type === FieldType.LINK
  tooltip?: boolean;
  tooltipContent?: string; // tooltip content to be displayed if tooltip === true
  className?: string; // custom tailwind classes to be added to the table cell
  arrayName?: string; // the key in the api response if type === FieldType.ARRAY_VALUE and the value is an array of objects than array of strings
  // toggleChecked?: boolean;
  onToggle?: (value: boolean, id: string) => void;
  actions? : Actions
}

export interface Params {
  uniqueId: string;
  filterData?: Array<{
    type: FilterDataType;
    name: string;
    textValue: string;
    options: Array<{
      value: string;
      label: string;
    }>;
  }>;
  fields: Array<Field>;
  api: string;
  params?: Record<string, any>;
}

export interface FieldComponentProps<T> {
  value: T;
  fieldData: Field;
  id: string;
}