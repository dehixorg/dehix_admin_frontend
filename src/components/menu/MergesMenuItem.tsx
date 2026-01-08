"use client";

// MergedMenuItem.tsx

import React, { useState, useRef } from "react";
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
  const iconRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const rect = iconRef.current?.getBoundingClientRect();

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // 👈 delay in ms (adjust if needed)
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Parent Icon */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={iconRef}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg
              text-muted-foreground transition-colors hover:text-foreground
              md:h-8 md:w-8
              ${
                subItems.some((item) => item.label === active)
                  ? "bg-accent text-foreground"
                  : ""
              }
            `}
          >
            {React.cloneElement(parentItem.icon as React.ReactElement, {
              className: "h-5 w-5",
            })}
            {parentItem.label && (
              <span className="sr-only">{parentItem.label}</span>
            )}
          </div>
        </TooltipTrigger>

        {parentItem.label && (
          <TooltipContent side="right">{parentItem.label}</TooltipContent>
        )}
      </Tooltip>

      {/* Dropdown */}
      {isOpen && rect && (
        <div
          className="fixed z-[9999] w-56 rounded-lg border bg-background shadow-2xl"
          style={{
            left: rect.right + 8,
            top: rect.top + rect.height / 2,
            transform: "translateY(-50%)",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="py-2">
            {subItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors
                  ${
                    item.label === active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MergedMenuItem;
