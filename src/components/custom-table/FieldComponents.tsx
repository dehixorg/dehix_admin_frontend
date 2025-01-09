import Link from "next/link";
import { DeleteButtonIcon } from "../ui/deleteButton";
import { Actions, Currency, FieldComponentProps, FieldType } from "./FieldTypes";
import { useState } from "react";
import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ArrowRight } from "lucide-react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";

export const DateTimeField = ({ value }: FieldComponentProps<string>) => {
  const date = new Date(value);
  return <>{date.toLocaleDateString()}</>;
};

export const TextField = ({ value }: FieldComponentProps<string>) => {
  return <span>{value}</span>;
};

export const DeleteButton = ({
  fieldData,
  id,
}: FieldComponentProps<string>) => {
  return (
    <DeleteButtonIcon
      // onClick={() => fieldData.deleteAction?.(id)}
      className=""
    />
  );
};

export const LinkField = ({
  value,
  fieldData,
}: FieldComponentProps<string>) => {
  return (
    <Link
      href={value}
      target="__blank"
      className="text-blue-400 hover:underline"
    >
      {fieldData.link}
    </Link>
  );
};

export const ToggleField = ({
  fieldData,
  value,
  id,
}: FieldComponentProps<boolean | string>) => {
  "use client";
  const [toggleVal, setToggleVal] = useState(Boolean(value));

  return (
    <Switch
      checked={toggleVal}
      onCheckedChange={() => {
        setToggleVal(!toggleVal);
        fieldData.onToggle?.(!toggleVal, id);
      }}
    />
  );
};

export const ArrayValueField = ({
  value,
  fieldData,
}: FieldComponentProps<Array<Record<string, any>>>) => {
  return (
    <div className="relative group cursor-pointer">
      {value.length > 0 ? (
        <>
          <span>{value[0][fieldData.arrayName!]} </span>
          <span className="text-xs text-gray-500">
            {value.length > 1 && `+${value.length - 1} more`}
          </span>
          <span
            className={` absolute bottom-[-25px] left-2 bg-gray-300 text-xs p-1 rounded transition-all text-gray-700 group-hover:block hidden`}
          >
            {value.map((val: any) => `${val[fieldData.arrayName!]} `)}
          </span>
        </>
      ) : (
        <span>/</span>
      )}
    </div>
  );
};

export const ActionField = ({
  id,
  fieldData,
}: FieldComponentProps<Actions>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-sm text-gray-600 hover:bg-gray-200 p-1 rounded transition duration-300">
        {fieldData.actions?.icon ? (
          fieldData.actions.icon
        ) : fieldData.actions?.options.length == 1 ? (
          <ArrowRight />
        ) : (
          <DotsVerticalIcon />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {fieldData.actions?.options.map(
          (
            { actionIcon, actionName, type, handler, href, className },
            index
          ) => (
            <DropdownMenuItem
              key={index}
              className={`w-${fieldData.width || "32"} px-0 py-0 my-1`}
            >
              {type == "Button" ? (
                <div
                  onClick={() => handler?.(id)}
                  className={twMerge(
                    "text-sm w-full py-2 px-3 flex items-center justify-start hover:cursor-pointer gap-4 font-medium text-gray-600",
                    className
                  )}
                >
                  {actionIcon}
                  <span>{actionName}</span>
                </div>
              ) : (
                <Link
                  href={href || "#"}
                  className={twMerge(
                    "text-sm w-full flex py-2 px-3 items-center justify-start gap-4 font-medium text-gray-600",
                    className
                  )}
                >
                  {actionIcon}
                  <span>{actionName}</span>
                </Link>
              )}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const numberFormat = (value: string, currency: Currency = Currency.INR) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0
  }).format(Number(value));

export const CurrencyField = ({ fieldData, value }: FieldComponentProps<string>) => {
  return <span>{numberFormat(value, fieldData.currency)}</span>;
};

export const mapTypeToComponent = (type: FieldType) => {
  switch (type) {
    case FieldType.DATETIME:
      return DateTimeField;
    case FieldType.TEXT:
      return TextField;
    case FieldType.DELETE:
      return DeleteButton;
    case FieldType.LINK:
      return LinkField;
    case FieldType.ARRAY_VALUE:
      return ArrayValueField;
    case FieldType.TOGGLE:
      return ToggleField;
    case FieldType.ACTION:
      return ActionField;
    case FieldType.CURRENCY:
      return CurrencyField
    default:
      return TextField;
  }
};

export const CustomTableCell = ({
  value,
  fieldData,
  id,
}: FieldComponentProps<any>) => {
  const FieldComponentToRender = mapTypeToComponent(fieldData.type);
  return <FieldComponentToRender fieldData={fieldData} value={value} id={id} />;
};
