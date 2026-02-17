import { twMerge } from "tailwind-merge";
import { CustomTableChildComponentsProps, HeaderActions } from "./FieldTypes";
import React from "react";
import { Button } from "../ui/button";

interface HeaderActionComponentProps extends CustomTableChildComponentsProps {
  headerActions?: Array<HeaderActions | React.FC<CustomTableChildComponentsProps>>;
}

export const HeaderActionComponent = ({
  headerActions,
  refetch
}: HeaderActionComponentProps) => {
  if (!headerActions?.length) return null;

  return (
    <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
      {headerActions.map((actionItem, index) => {
        if (typeof actionItem === "function") {
          const ActionComponent = actionItem;
          return <ActionComponent refetch={refetch} key={index} />;
        }

        const isIconOnly = !actionItem.name?.trim();

        return (
          <Button
            type="button"
            key={index}
            size={isIconOnly ? "icon" : "sm"}
            variant="outline"
            aria-label={actionItem.name || `action-${index + 1}`}
            className={twMerge(
              "rounded-full border-border/70 bg-background/80 shadow-sm transition-all hover:bg-accent hover:shadow",
              isIconOnly ? "h-8 w-8" : "h-8 gap-2 px-3",
              actionItem.className
            )}
            onClick={actionItem.handler}
          >
            {actionItem.icon}
            {!isIconOnly && actionItem.name}
          </Button>
        );
      })}
    </div>
  );
};
