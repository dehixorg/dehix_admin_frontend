'use client';

import React from 'react';
import { Search } from 'lucide-react';

import SidebarMenu, { MenuItem } from '@/components/menu/sidebarMenu';
import CollapsibleSidebarMenu from '@/components/menu/collapsibleSidebarMenu';
import Breadcrumb from '@/components/shared/breadcrumbList';
import DropdownProfile from '@/components/shared/DropdownProfile';
import { Input } from '@/components/ui/input';

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
  searchPlaceholder = 'Search...',
  containerClassName = "bg-background",
  contentClassName = 'flex flex-col sm:gap-4 sm:pl-16',
  mainClassName = 'ml-5 mr-5',
  children,
}: Props) {
  return (
    <div className={containerClassName ?? 'flex min-h-screen w-full flex-col bg-muted/40'}>
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
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active={active}
          />
          {breadcrumbItems.length > 0 ? <Breadcrumb items={breadcrumbItems} /> : null}
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
          <DropdownProfile />
        </header>
        <main className={mainClassName}>{children}</main>
      </div>
    </div>
  );
}
