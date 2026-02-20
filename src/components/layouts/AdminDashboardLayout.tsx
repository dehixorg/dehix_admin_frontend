'use client';

import React from 'react';
import DashboardShell from '@/components/layouts/DashboardShell';
import {
  menuItemsBottom,
  menuItemsTop,
} from '@/config/menuItems/admin/dashboardMenuItems';

type BreadcrumbItem = {
  label: string;
  link: string;
};

type Props = {
  active: string;
  breadcrumbItems?: BreadcrumbItem[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  containerClassName?: string;
  contentClassName?: string;
  mainClassName?: string;
  children: React.ReactNode;
};

export default function AdminDashboardLayout({
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
    <DashboardShell
      menuItemsTop={menuItemsTop}
      menuItemsBottom={menuItemsBottom}
      active={active}
      breadcrumbItems={breadcrumbItems}
      showSearch={showSearch}
      searchPlaceholder={searchPlaceholder}
      containerClassName={containerClassName}
      contentClassName={contentClassName}
      mainClassName={mainClassName}
    >
      {children}
    </DashboardShell>
  );
}
