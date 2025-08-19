// MergedMenuItem.tsx

import React, { useState } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label?: string;
}

type MergedMenuItemProps = {
  parentItem: MenuItem;
  subItems: MenuItem[];
  active: string;
};

const MergedMenuItem: React.FC<MergedMenuItemProps> = ({
  parentItem,
  subItems,
  active,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="#"
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
              subItems.some((subItem) => subItem.label === active) ? "bg-accent" : ""
            }`}
          >
            {React.cloneElement(parentItem.icon as React.ReactElement, {
              className: "h-6 w-6",
            })}
            {parentItem.label && <span className="sr-only">{parentItem.label}</span>}
          </Link>
        </TooltipTrigger>
        {parentItem.label && <TooltipContent side="right">{parentItem.label}</TooltipContent>}
      </Tooltip>

      {isOpen && (
        <div
          className="absolute left-10 -ml-2 top-1/2 -translate-y-1/2 z-20 w-48 rounded-md border bg-popover p-2 shadow-lg"
        >
          {subItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                item.label === active ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MergedMenuItem;