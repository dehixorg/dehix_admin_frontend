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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Streak Rewards"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Streak Rewards"
          />
          <Breadcrumb items={breadcrumbItems} />
          <div className="ml-auto">
            <DropdownProfile />
          </div>
        </header>
        <main className="ml-5 mr-3">
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
        </main>
      </div>
    </div>
  );
};

export default StreakRewardsPage;
