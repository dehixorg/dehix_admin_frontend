import Link from "next/link";
import { DeleteButtonIcon } from "../ui/deleteButton";
import { FieldComponentProps } from "./FieldTypes";
import { useState } from "react";
import { Switch } from "../ui/switch";

export const DateTimeField = ({ value }: FieldComponentProps) => {
    const date = new Date(value);
    return <>{date.toLocaleDateString()}</>;
  };
  
export const TextField = ({ value }: FieldComponentProps) => {
    return <span>{value}</span>;
  };
  
export const DeleteButton = ({ fieldData, id }: FieldComponentProps) => {
    return <DeleteButtonIcon onClick={() => fieldData.deleteAction?.(id)} className="" />;
  };
  
export const LinkField = ({ value, fieldData }: FieldComponentProps) => {
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
  
export const ToggleField = ({ fieldData, value, id }: FieldComponentProps) => {
    "use client"
    const [toggleVal, setToggleVal] = useState(value);
  
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
  
export const ArrayValueField = ({ value, fieldData }: FieldComponentProps) => {
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
  