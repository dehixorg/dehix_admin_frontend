import React from "react";
import Link from "next/link";

import { ThemeToggle } from "../shared/themeToggle";
import MergedMenuItem from "./MergesMenuItem";
import { useAdminSidebarNotifications } from "@/hooks/useAdminSidebarNotifications";

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
  count?: number;
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
  const notifications = useAdminSidebarNotifications();

  // Helper to map notifications to menu items
  const mapCountsToItems = (items: MenuItem[]): MenuItem[] => {
    return items.map((item) => {
      let count = 0;

      if (item.label === "Connects") count = notifications.connects || 0;
      if (item.label === "Skill") count = notifications.skill || 0;
      if (item.label === "Domain") count = notifications.domain || 0;
      if (item.label === "Project Domain")
        count = notifications.projectDomain || 0;
      // Match the actual label "Verification" (submenu item) instead of "Oracle Verification"
      if (item.label === "Verification") count = notifications.oracle || 0;

      // Ensure subItems also get the updated counts
      const updatedSubItems = item.subItems
        ? mapCountsToItems(item.subItems)
        : undefined;

      if (count > 0) {
        console.log(`Mapping count to ${item.label}:`, count);
      }

      return { ...item, count, subItems: updatedSubItems };
    });
  };

  const topItems = mapCountsToItems(menuItemsTop);
  const bottomItems = mapCountsToItems(menuItemsBottom);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden h-screen w-16 flex-col border-r bg-background sm:flex">
      <nav className="flex h-full flex-col items-center gap-3 overflow-y-auto overflow-x-hidden px-2 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30">
        {topItems.map((item, index) => {
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
          const linkClasses = `flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:text-foreground hover:bg-accent
            ${
              isDehix
                ? "group shrink-0 gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                : isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
            }`;

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={isDehix ? "#" : item.href}
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
        {bottomItems.map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8 ${
                  item.label === "Dehix"
                    ? "group shrink-0 gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
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
