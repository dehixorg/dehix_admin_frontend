"use client";

// MergedMenuItem.tsx

import React, { useState, useRef, useEffect } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
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

  const toggleMenu = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      toggleMenu(e);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative h-10 w-10 flex items-center justify-center shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Parent Icon */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={iconRef}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={isOpen}
            onClick={toggleMenu}
            onKeyDown={handleKeyDown}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg relative overflow-visible
              text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              ${
                subItems.some((item) => item.label === active)
                  ? "bg-accent text-accent-foreground"
                  : ""
              }
            `}
          >
            <span className="relative flex-shrink-0">
              {React.cloneElement(parentItem.icon as React.ReactElement, {
                className: "h-5 w-5",
              })}
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 z-10 flex h-4 min-w-[18px] items-center justify-center rounded-full px-1 bg-purple-500 text-[10px] font-bold text-white shadow-sm">
                  {totalCount}
                </span>
              )}
            </span>
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
          className="fixed z-[9999] w-48 rounded-xl border border-border/80 bg-popover shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out"
          style={{
            left: rect.right + 10,
            top: rect.top + rect.height / 2,
            transform: "translateY(-50%)",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex flex-col p-1">
            {subItems.map((item, index) => {
              const isSubItemActive = item.label === active;
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group relative flex items-center justify-between gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200
                    ${
                      isSubItemActive
                        ? "bg-accent text-accent-foreground font-bold"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }
                  `}
                >
                  {/* Active Indicator Bar */}
                  {isSubItemActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-r-full bg-primary" />
                  )}

                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200
                      ${isSubItemActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground"}
                    `}>
                      {React.cloneElement(item.icon as React.ReactElement, {
                        size: 14,
                      })}
                    </div>
                    <span className="whitespace-nowrap transition-colors">{item.label}</span>
                  </div>

                  {(item.count || 0) > 0 && (
                    <span className={`flex h-4.5 min-w-[18px] px-1 items-center justify-center rounded-full text-[9px] font-bold shadow-sm transition-all
                      ${isSubItemActive ? "bg-primary text-primary-foreground" : "bg-purple-500 text-white"}
                    `}>
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MergedMenuItem;
