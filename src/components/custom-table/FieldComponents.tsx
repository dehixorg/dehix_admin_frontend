import Link from "next/link";
import {
  Actions,
  Currency,
  FieldComponentProps,
  FieldType,
} from "./FieldTypes";
import { useState } from "react";
import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";
import { ToolTip } from "../ToolTip";
import { cn } from "@/lib/utils";

// Single source of truth for both solid and outline styles
type StatusStyle = { solid: string; outline: string };

const STATUS_STYLE_MAP: Record<string, StatusStyle> = {
  // Green family
  accepted: {
    solid: "bg-green-500 text-white",
    outline:
      "border-green-700/40 text-green-600 bg-green-100 hover:bg-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/60",
  },
  active: {
    solid: "bg-green-500 text-white",
    outline:
      "border-green-700/40 text-green-600 bg-green-100 hover:bg-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/60",
  },
  verified: {
    solid: "bg-green-500 text-white",
    outline:
      "border-green-700/40 text-green-600 bg-green-100 hover:bg-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/60",
  },
  added: {
    solid: "bg-green-500 text-white",
    outline:
      "border-green-700/40 text-green-600 bg-green-100 hover:bg-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/60",
  },
  approved: {
    solid: "bg-green-500 text-black",
    outline:
      "border-green-700/40 text-green-600 bg-green-100 hover:bg-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/60",
  },

  // Yellow family
  pending: {
    solid: "bg-yellow-500 text-black",
    outline:
      "border-yellow-700/40 text-yellow-600 bg-yellow-100 hover:bg-yellow-300 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/50",
  },
  ongoing: {
    solid: "bg-yellow-500 text-black",
    outline:
      "border-yellow-700/40 text-yellow-600 bg-yellow-100 hover:bg-yellow-300 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/50",
  },

  // Red family
  rejected: {
    solid: "bg-red-500 text-black",
    outline:
      "border-red-700/40 text-red-600 bg-red-100 hover:bg-red-300 dark:bg-red-900/20 dark:hover:bg-red-900/60",
  },

  // Purple family
  mastery: {
    solid: "bg-purple-600 text-white",
    outline:
      "border-purple-700/40 text-purple-600 bg-purple-100 hover:bg-purple-300 dark:bg-purple-900/20 dark:hover:bg-purple-900/60",
  },

  // Blue family
  proficient: {
    solid: "bg-blue-500 text-white",
    outline:
      "border-blue-700/40 text-blue-600 bg-blue-100 hover:bg-blue-300 dark:bg-blue-900/20 dark:hover:bg-blue-900/60",
  },

  // Dehix talent expertise levels
  intermediate: {
    solid: "bg-sky-500 text-white",
    outline:
      "border-sky-700/40 text-sky-600 bg-sky-100 hover:bg-sky-300 dark:bg-sky-900/20 dark:hover:bg-sky-900/60",
  },
  advanced: {
    solid: "bg-indigo-500 text-white",
    outline:
      "border-indigo-700/40 text-indigo-600 bg-indigo-100 hover:bg-indigo-300 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/60",
  },
  expert: {
    solid: "bg-purple-700 text-white",
    outline:
      "border-purple-800/40 text-purple-700 bg-purple-100 hover:bg-purple-300 dark:bg-purple-900/30 dark:hover:bg-purple-900/70",
  },

  // Green-light family
  beginner: {
    solid: "bg-green-400 text-white",
    outline:
      "border-green-700/40 text-green-600 bg-green-100 hover:bg-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/60",
  },

  // Neutral/gray fallback-like status
  completed: {
    solid: "bg-gray-500 text-white",
    outline:
      "border-gray-700/40 text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900/20 dark:hover:bg-gray-900/40",
  },

  // Profile types
  freelancer: {
    solid: "bg-blue-500 text-white",
    outline:
      "border-blue-700/40 text-blue-600 bg-blue-100 hover:bg-blue-300 dark:bg-blue-900/20 dark:hover:bg-blue-900/60",
  },
  consultant: {
    solid: "bg-purple-600 text-white",
    outline:
      "border-purple-700/40 text-purple-600 bg-purple-100 hover:bg-purple-300 dark:bg-purple-900/20 dark:hover:bg-purple-900/60",
  },
};

const FALLBACK: StatusStyle = {
  solid: "bg-gray-500 text-white",
  outline: "border-muted-foreground/30 text-foreground bg-muted/30",
};

// Uppercase status aliases to map to lowercase keys for BC
const STATUS_ALIASES: Record<string, string> = {
  PENDING: "pending",
  ACTIVE: "active",
  APPROVED: "approved",
  REJECTED: "rejected",
  VERIFIED: "verified",
  ADDED: "added",
  MASTERY: "mastery",
  PROFICIENT: "proficient",
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
  EXPERT: "expert",
  COMPLETED: "completed",
  FREELANCER: "freelancer",
  CONSULTANT: "consultant",
};

const resolveKey = (status?: string) => {
  const raw = (status || "").trim();
  if (!raw) return "";
  const upper = raw.toUpperCase();
  if (STATUS_ALIASES[upper]) return STATUS_ALIASES[upper];
  return raw.toLowerCase();
};

// Backward-compatible exports
export const getBadgeColor = (status: string) => {
  const key = resolveKey(status);
  return (STATUS_STYLE_MAP[key] || FALLBACK).solid;
};

export const statusOutlineClasses = (s?: string) => {
  const key = resolveKey(s);
  return (STATUS_STYLE_MAP[key] || FALLBACK).outline;
};

export const profileTypeOutlineClasses = (profileType?: string) => {
  const upper = (profileType || "").toUpperCase();
  const key =
    upper === "CONSULTANT"
      ? "consultant"
      : upper === "FREELANCER"
        ? "freelancer"
        : "freelancer";
  return (STATUS_STYLE_MAP[key] || STATUS_STYLE_MAP.freelancer).outline;
};

const DateTimeField = ({ value }: FieldComponentProps<string>) => {
  const date = new Date(value);
  return <>{date.toUTCString()}</>;
};

const DateField = ({ value }: FieldComponentProps<string>) => {
  const date = new Date(value);
  return <>{date.toLocaleDateString()}</>;
};

const TextField = ({ value }: FieldComponentProps<string>) => {
  return <span>{value}</span>;
};

const LinkField = ({ value, fieldData }: FieldComponentProps<string>) => {
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

const ToggleField = ({
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

const ArrayValueField = ({
  value,
  fieldData,
}: FieldComponentProps<Array<Record<string, any>>>) => {
  if (!value || !Array.isArray(value)) {
    return <span>-</span>;
  }

  const safeValue = value;

  const getDisplayValue = (item: any): string => {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (fieldData.arrayName && typeof item === "object") {
      return item[fieldData.arrayName] || "";
    }
    return String(item);
  };

  return (
    <div className="relative group cursor-pointer">
      {safeValue.length > 0 ? (
        <ToolTip
          trigger={
            <div className="">
              <span>{getDisplayValue(safeValue[0])} </span>
              <span className="text-xs text-gray-500">
                {safeValue.length > 1 && `+${safeValue.length - 1} more`}
              </span>
            </div>
          }
          content={safeValue
            .map((val: any) => getDisplayValue(val))
            .filter(Boolean) // Remove any empty strings
            .join(", ")}
        />
      ) : (
        <span className="text-xs text-gray-500">-</span>
      )}
    </div>
  );
};

const ActionField = ({
  id,
  fieldData,
  refetch,
}: FieldComponentProps<Actions>) => {
  if (fieldData.actions?.options && fieldData.actions.options.length === 1) {
    const { type, handler, href, className } = fieldData.actions.options[0];

    if (type === "Button") {
      return (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={async () => {
            await handler?.({ id, refetch });
            refetch && refetch();
          }}
          className={twMerge("h-8 w-8", className)}
        >
          {fieldData.actions?.icon ? (
            fieldData.actions.icon
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </Button>
      );
    }

    if (type === "Link") {
      return (
        <Link
          href={href || "#"}
          className={twMerge(
            "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-accent",
            className
          )}
        >
          {fieldData.actions?.icon ? (
            fieldData.actions.icon
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </Link>
      );
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
          {fieldData.actions?.icon ? (
            fieldData.actions.icon
          ) : (
            <DotsVerticalIcon />
          )}
        </Button>
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
              {type === "Button" && (
                <div
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await handler?.({ id, refetch });
                    refetch && refetch();
                  }}
                  className={twMerge(
                    "text-sm w-full py-2 px-3 flex items-center dark:text-gray-300 justify-start hover:cursor-pointer gap-4 font-medium text-gray-600",
                    className
                  )}
                >
                  {actionIcon}
                  <span>{actionName}</span>
                </div>
              )}
              {type === "Link" && (
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
    maximumFractionDigits: 0,
  }).format(Number(value));

const CurrencyField = ({ fieldData, value }: FieldComponentProps<string>) => {
  return <span>{numberFormat(value, fieldData.currency)}</span>;
};

const StatusField = ({ value, fieldData }: FieldComponentProps<string>) => {
  const statusMetaData = fieldData.statusFormats?.find(
    (status) => status.value.toLowerCase() === String(value).toLowerCase()
  );

  if (!statusMetaData) {
    const normalizedValue = String(value).toLowerCase().replace(/_/g, ' ');

    let badgeClasses = "bg-gray-500/20 text-gray-700 dark:text-gray-400";

    if (normalizedValue.includes('not') || normalizedValue.includes('inactive') || normalizedValue.includes('blocked')) {
      badgeClasses = "bg-red-500/20 text-red-700 dark:text-red-400";
    } else if (normalizedValue.includes('active') || normalizedValue.includes('verified')) {
      badgeClasses = "bg-green-500/20 text-green-700 dark:text-green-400";
    } else if (normalizedValue.includes('pending') || normalizedValue.includes('waiting')) {
      badgeClasses = "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
    }

    return (
      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${badgeClasses}`}>
        {value}
      </span>
    );
  }

  const { isUppercase } = statusMetaData;
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium border",
        statusOutlineClasses(statusMetaData.textValue || String(value)),
        isUppercase && "uppercase"
      )}
    >
      {statusMetaData.textValue}
    </Badge>
  );
};

export const TooltipField = ({
  value,
  fieldData,
}: FieldComponentProps<string>) => {
  return <ToolTip trigger={value} content={fieldData.tooltipContent || ""} />;
};

const LongTextField = ({ fieldData, value }: FieldComponentProps<string>) => {
  if (!value) return <span>-</span>;
  if (fieldData.wordsCnt && value.length <= fieldData.wordsCnt)
    return <span>{value}</span>;

  if (fieldData.wordsCnt)
    return (
      <ToolTip
        trigger={
          <span className=" line-clamp-1">
            {value.slice(0, fieldData.wordsCnt)}...
          </span>
        }
        content={value || ""}
      />
    );

  return (
    <ToolTip
      trigger={<span className=" line-clamp-1">{value}</span>}
      content={value || ""}
    />
  );
};

const CustomComponent = ({
  fieldData,
  id,
  value,
  refetch,
}: FieldComponentProps<any>) => {
  if (!fieldData.CustomComponent) return <div>{id}</div>;
  const Component = fieldData.CustomComponent;
  return <Component id={id} data={value} refetch={refetch} />;
};

const LengthField = ({ value }: FieldComponentProps<Record<string, any>[]>) => {
  if (!value || !Array.isArray(value)) return <span>0</span>;
  return <span>{value.length}</span>;
};

export const mapTypeToComponent = (type: FieldType) => {
  switch (type) {
    case FieldType.DATETIME:
      return DateTimeField;
    case FieldType.DATE:
      return DateField;
    case FieldType.TEXT:
      return TextField;
    case FieldType.LINK:
      return LinkField;
    case FieldType.ARRAY_VALUE:
      return ArrayValueField;
    case FieldType.TOGGLE:
      return ToggleField;
    case FieldType.ACTION:
      return ActionField;
    case FieldType.CURRENCY:
      return CurrencyField;
    case FieldType.STATUS:
      return StatusField;
    case FieldType.CRYPTO:
      return CurrencyField;
    case FieldType.TOOLTIP:
      return TooltipField;
    case FieldType.LONGTEXT:
      return LongTextField;
    case FieldType.CUSTOM:
      return CustomComponent;
    case FieldType.LENGTH:
      return LengthField;
    default:
      return TextField;
  }
};

export const CustomTableCell = ({
  value,
  fieldData,
  id,
  refetch,
}: FieldComponentProps<any>) => {
  const FieldComponentToRender = mapTypeToComponent(fieldData.type);
  return (
    <FieldComponentToRender
      fieldData={fieldData}
      value={value}
      id={id}
      refetch={refetch}
    />
  );
};
