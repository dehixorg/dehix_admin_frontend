import * as React from "react";
import Link from "next/link";
import { PanelLeft } from "lucide-react";

import { ThemeToggle } from "../shared/themeToggle";
import { MenuItem } from "./sidebarMenu";
import MergedMenuItem from "./MergesMenuItem";

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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col h-full p-0 w-[280px] sm:max-w-xs">
        <div className="flex-1 overflow-y-auto py-4 h-[calc(100vh-120px)]">
          <nav className="space-y-6 px-2.5">
            {menuItemsTop.map((item, index) => {
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
                  <span className="flex-shrink-0">{item.icon}</span>
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
                  if (item.href === '#') {
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
