'use client';

import React from 'react';

import DashboardShell from '@/components/layouts/DashboardShell';
import {
  menuItemsBottom,
  menuItemsTop,
} from '@/config/menuItems/freelancer/dashboardMenuItems';

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

export default function FreelancerDashboardLayout(props: Props) {
  return (
    <DashboardShell
      menuItemsTop={menuItemsTop}
      menuItemsBottom={menuItemsBottom}
      {...props}
    />
  );
}
