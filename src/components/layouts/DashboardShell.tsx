"use client";

import React from "react";
import { Search, RefreshCw } from "lucide-react";

import SidebarMenu, { MenuItem } from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminSidebarNotifications } from "@/hooks/useAdminSidebarNotifications";
import { useToast } from "@/components/ui/use-toast";

type BreadcrumbItem = {
  label: string;
  link: string;
};

type Props = {
  menuItemsTop: MenuItem[];
  menuItemsBottom: MenuItem[];
  active: string;
  breadcrumbItems?: BreadcrumbItem[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  containerClassName?: string;
  contentClassName?: string;
  mainClassName?: string;
  children: React.ReactNode;
};

export default function DashboardShell({
  menuItemsTop,
  menuItemsBottom,
  active,
  breadcrumbItems = [],
  showSearch = true,
  searchPlaceholder = "Search...",
  containerClassName = "bg-background",
  contentClassName = "flex flex-col sm:gap-4 sm:pl-16",
  mainClassName = "ml-5 mr-5",
  children,
}: Props) {
  const { refreshNotifications } = useAdminSidebarNotifications();
  const { toast } = useToast();

  const handleRefreshClick = () => {
    refreshNotifications();
    toast({
      title: "Notifications Refreshed",
      description: "Notification counts have been updated successfully.",
    });
  };

  return (
    <div
      className={
        containerClassName ?? "flex min-h-screen w-full flex-col bg-muted/40"
      }
    >
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active={active}
      />
      <div className={contentClassName}>
        <header
          role="banner"
          aria-label="Site header"
          className="sticky top-0 z-30 flex h-14 items-center py-6 gap-4 border-b bg-muted-foreground/20 dark:bg-muted/20 px-4 sm:px-6 backdrop-blur-md"
        >
          {breadcrumbItems.length > 0 ? (
            <Breadcrumb items={breadcrumbItems} />
          ) : null}
          {showSearch ? (
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
          ) : (
            <div className="ml-auto" />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshClick}
            className="h-8 w-8 p-0"
            title="Refresh Notifications"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active={active}
          />
          <DropdownProfile />
        </header>
        <main className={mainClassName}>{children}</main>
      </div>
    </div>
  );
}
