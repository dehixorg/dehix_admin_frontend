"use client";

import { useState } from "react";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
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
    <AdminDashboardLayout
      active="Leaderboard"
      breadcrumbItems={[
        
        { label: "Leaderboard", link: "/admin/leaderboard" },
      ]}
      showSearch={false}
      mainClassName="ml-5 mr-3"
    >
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
    </AdminDashboardLayout>
  );
}
