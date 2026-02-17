'use client';

import React from 'react';

import DashboardShell from '@/components/layouts/DashboardShell';
import {
  menuItemsBottom,
  menuItemsTop,
} from '@/config/menuItems/business/dashboardMenuItems';

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

export default function BusinessDashboardLayout(props: Props) {
  return (
    <DashboardShell
      menuItemsTop={menuItemsTop}
      menuItemsBottom={menuItemsBottom}
      {...props}
    />
  );
}
