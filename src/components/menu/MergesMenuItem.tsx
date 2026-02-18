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
  count?: number; // Added count property
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

  // Calculate total count for parent badge
  const totalCount = subItems.reduce((acc, item) => acc + (item.count || 0), 0);

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
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg relative overflow-visible
              text-foreground transition-colors hover:bg-gray-300 hover:text-foreground
              md:h-8 md:w-8
              ${
                subItems.some((item) => item.label === active)
                  ? "bg-gray-300 text-foreground"
                  : ""
              }
            `}
          >
            {React.cloneElement(parentItem.icon as React.ReactElement, {
              className: "h-5 w-5",
            })}
             {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white">
                {totalCount}
              </span>
            )}
            {parentItem.label && (
              <span className="sr-only">{parentItem.label}</span>
            )}
          </div>
        </TooltipTrigger>

        {parentItem.label && (
          <TooltipContent side="right">{parentItem.label} {totalCount > 0 ? `(${totalCount})` : ''}</TooltipContent>
        )}
      </Tooltip>

      {/* Dropdown */}
      {isOpen && rect && (
        <div
          className="fixed z-[9999] w-64 rounded-lg border bg-background shadow-2xl"
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
                className={`flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors
                  ${
                    item.label === active
                      ? "bg-gray-300 text-foreground"
                      : "text-muted-foreground hover:bg-gray-300 hover:text-foreground"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                 {(item.count || 0) > 0 ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white">
                    {item.count}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MergedMenuItem;
