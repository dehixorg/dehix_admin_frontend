"use client";

import React from "react";
import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";
import { CustomTable } from "@/components/custom-table/CustomTable";
import { FieldType } from "@/components/custom-table/FieldTypes";
import CreateStreakRewardDialog from "@/components/StreakRewards/CreateStreakRewardDialog";
import StreakRewardActions from "@/components/StreakRewards/StreakRewardActions";
import {
  menuItemsTop,
  menuItemsBottom,
} from "@/config/menuItems/admin/dashboardMenuItems";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";

const StreakRewardsPage = () => {
  const fields = [
    {
      fieldName: "days",
      textValue: "Days",
      type: FieldType.TEXT,
    },
    {
      fieldName: "reward",
      textValue: "Reward (Connects)",
      type: FieldType.TEXT,
    },
    {
      fieldName: "title",
      textValue: "Title",
      type: FieldType.TEXT,
    },
    {
      fieldName: "isActive",
      textValue: "Status",
      type: FieldType.STATUS,
      statusFormats: [
        {
          value: "true",
          textValue: "Active",
          bgColor: "#10b981",
          textColor: "#ffffff",
        },
        {
          value: "false",
          textValue: "Inactive",
          bgColor: "#6b7280",
          textColor: "#ffffff",
        },
      ],
    },
    {
      textValue: "",
      type: FieldType.CUSTOM,
      CustomComponent: StreakRewardActions,
    },
  ];

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin/dashboard" },
    { label: "Streak Rewards", link: "#" },
  ];

  return (
    <AdminDashboardLayout
      active="Streak Rewards"
      breadcrumbItems={breadcrumbItems}
      showSearch={false}
      mainClassName="mx-5"
    >
      <CustomTable
        api="/admin/streak-rewards"
        fields={fields}
        uniqueId="_id"
        title="Streak Rewards"
        searchColumn={["days", "title"]}
        tableHeaderActions={[CreateStreakRewardDialog]}
        emptyStateAction={CreateStreakRewardDialog}
        isDownload={true}
      />
    </AdminDashboardLayout>
  );
};

export default StreakRewardsPage;
