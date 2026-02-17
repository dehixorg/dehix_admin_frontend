"use client";

import { useState } from "react";
import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";
import {
  menuItemsTop,
  menuItemsBottom,
} from "@/config/menuItems/admin/dashboardMenuItems";
import { CustomTable } from "@/components/custom-table/CustomTable";
import { FieldType } from "@/components/custom-table/FieldTypes";
import CreateLeaderboardDialog from "@/components/Leaderboard/CreateLeaderboardDialog";
import LeaderboardActions from "@/components/Leaderboard/LeaderboardActions";
import { format } from "date-fns";

export default function LeaderboardPage() {
  const fields = [
    {
      fieldName: "name",
      textValue: "Contest Name",
      type: FieldType.TEXT,
    },
    {
      fieldName: "frequency",
      textValue: "Frequency",
      type: FieldType.STATUS,
      statusFormats: [
        {
          value: "WEEKLY",
          textValue: "Weekly",
          bgColor: "#3b82f6",
          textColor: "#ffffff",
        },
        {
          value: "BIWEEKLY",
          textValue: "Biweekly",
          bgColor: "#a855f7",
          textColor: "#ffffff",
        },
        {
          value: "MONTHLY",
          textValue: "Monthly",
          bgColor: "#10b981",
          textColor: "#ffffff",
        },
      ],
    },
    {
      fieldName: "status",
      textValue: "Status",
      type: FieldType.STATUS,
      statusFormats: [
        {
          value: "SCHEDULED",
          textValue: "Scheduled",
          bgColor: "#3b82f6",
          textColor: "#ffffff",
        },
        {
          value: "ACTIVE",
          textValue: "Active",
          bgColor: "#f59e0b",
          textColor: "#ffffff",
        },
        {
          value: "PUBLISHED",
          textValue: "Published",
          bgColor: "#10b981",
          textColor: "#ffffff",
        },
        {
          value: "ARCHIVED",
          textValue: "Archived",
          bgColor: "#6b7280",
          textColor: "#ffffff",
        },
      ],
    },
    {
      textValue: "Period",
      type: FieldType.CUSTOM,
      CustomComponent: ({ data }: any) => {
        if (!data.periodStart || !data.periodEnd) return <span>-</span>;
        try {
          const start = format(new Date(data.periodStart), "MMM d");
          const end = format(new Date(data.periodEnd), "MMM d, yyyy");
          return <span>{`${start} - ${end}`}</span>;
        } catch {
          return <span>-</span>;
        }
      },
    },
    {
      textValue: "",
      type: FieldType.CUSTOM,
      CustomComponent: ({ data, id, refetch }: any) => (
        <LeaderboardActions data={data} id={id} refetch={refetch} />
      ),
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Leaderboard"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Leaderboard"
          />
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                link: "/dashboard",
              },
              {
                label: "Leaderboard",
                link: "/admin/leaderboard",
              },
            ]}
          />
          <div className="ml-auto">
            <DropdownProfile />
          </div>
        </header>
        <main className="ml-5 mr-3">
          <CustomTable
            api="/admin/leaderboard/get-all"
            uniqueId="_id"
            title="Leaderboard Contests"
            fields={fields}
            isDownload={true}
            searchColumn={["name", "frequency", "status"]}
            tableHeaderActions={[CreateLeaderboardDialog]}
            emptyStateAction={CreateLeaderboardDialog}
          />
        </main>
      </div>
    </div>
  );
}
