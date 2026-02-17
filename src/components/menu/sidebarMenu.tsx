import React from "react";
import Link from "next/link";

import { ThemeToggle } from "../shared/themeToggle";
import MergedMenuItem from "./MergesMenuItem"; // Corrected import

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  subItems?: MenuItem[];
}

type SidebarMenuProps = {
  menuItemsTop: MenuItem[];
  menuItemsBottom: MenuItem[];
  active: string;
  setActive?: (page: string) => void;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  menuItemsTop,
  menuItemsBottom,
  active,
  setActive = () => null,
}) => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden h-screen w-16 flex-col border-r bg-background sm:flex">
      <nav className="flex h-full flex-col items-center gap-3 overflow-y-auto overflow-x-hidden px-2 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30">
        {menuItemsTop.map((item, index) => {
          if (item.subItems) {
            return (
              <MergedMenuItem
                key={index}
                parentItem={item}
                subItems={item.subItems}
                active={active}
              />
            );
          }

          const isDehix = item.label === "Dehix";
          const isActive = item.label === active;
          const linkClasses = `flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-300 hover:text-foreground
            ${
              isDehix
                ? "group shrink-0 gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                : isActive
                  ? "bg-gray-300 text-foreground"
                  : "text-foreground"
            }`;

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={isActive || isDehix ? "#" : item.href}
                  onClick={() => item.label && setActive(item.label)}
                  className={linkClasses}
                >
                  {item.icon}
                  {item.label && <span className="sr-only">{item.label}</span>}
                </Link>
              </TooltipTrigger>
              {item.label && (
                <TooltipContent side="right">{item.label}</TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>

      <div className="mt-auto mx-auto">
        <ThemeToggle />
      </div>

      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        {menuItemsBottom.map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-300 hover:text-foreground md:h-8 md:w-8 
                  ${
                    item.label === "Dehix"
                      ? "group shrink-0 gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                      : item.label === active
                        ? "bg-gray-300 text-foreground"
                        : "text-foreground"
                  }`}
              >
                {item.icon}
                {item.label && <span className="sr-only">{item.label}</span>}
              </Link>
            </TooltipTrigger>
            {item.label && (
              <TooltipContent side="right">{item.label}</TooltipContent>
            )}
          </Tooltip>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarMenu;
