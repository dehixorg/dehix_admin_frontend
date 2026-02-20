import * as React from "react";
import Link from "next/link";
import { PanelLeft } from "lucide-react";

import { ThemeToggle } from "../shared/themeToggle";
import { MenuItem } from "./sidebarMenu";
import MergedMenuItem from "./MergesMenuItem";
import { useAdminSidebarNotifications } from "@/hooks/useAdminSidebarNotifications";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface CollapsibleSidebarMenuProps {
  menuItemsTop: MenuItem[];
  menuItemsBottom: MenuItem[];
  active: string;
  setActive?: (page: string) => void; // Making setActive optional
}

const CollapsibleSidebarMenu: React.FC<CollapsibleSidebarMenuProps> = ({
  menuItemsTop,
  menuItemsBottom,
  active,
  setActive = () => null, // Defaulting setActive to a no-op function
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

      return { ...item, count, subItems: updatedSubItems };
    });
  };

  const topItems = mapCountsToItems(menuItemsTop);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col h-full p-0 w-[280px] sm:max-w-xs"
      >
        <div className="flex-1 overflow-y-auto py-4 h-[calc(100vh-120px)]">
          <nav className="space-y-6 px-2.5">
            {topItems.map((item, index) => {
              if (item.subItems) {
                return (
                  <div key={index} className="relative">
                    <MergedMenuItem
                      parentItem={item}
                      subItems={item.subItems}
                      active={active}
                    />
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setActive(item.label)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    item.label === "Dehix"
                      ? "group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                      : item.label === active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <span className="flex-shrink-0 relative">
                    {item.icon}
                    {(item.count || 0) > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white z-10">
                        {item.count}
                      </span>
                    )}
                  </span>
                  {item.label && item.label !== "Dehix" && (
                    <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="shrink-0 border-t border-border p-4">
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </div>

        <div className="shrink-0 p-4">
          <nav className="space-y-6 px-2.5">
            {menuItemsBottom.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={(e) => {
                  if (item.href === "#") {
                    e.preventDefault();
                  }
                  setActive(item.label);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  item.label === "Dehix"
                    ? "group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    : item.label === active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {item.label !== "Dehix" && (
                  <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CollapsibleSidebarMenu;
