"use client";

import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { CustomTable } from "@/components/custom-table/CustomTable";
import {
  FieldType,
  Params as TableProps,
} from "@/components/custom-table/FieldTypes";
import AddNotify from "@/components/Notification/addNotify";
import { NotificationDetails } from "@/components/Notification/NotificationDetails";
import { notificationActions } from "@/components/Notification/notificationActions";

export default function Talent() {
  const customTableProps: TableProps = {
    api: "/ads",
    uniqueId: "_id",
    fields: [
      {
        textValue: "Type",
        type: FieldType.STATUS,
        fieldName: "type",
        statusFormats: [
          {
            value: "FREELANCER",
            bgColor: "#7c82f2",
            textColor: "#03085e",
            textValue: "Freelancer",
          },
          {
            value: "BUSINESS",
            bgColor: "yellow",
            textColor: "#525002",
            textValue: "Business",
          },
          {
            value: "BOTH",
            bgColor: "#57fa70",
            textColor: "#024d0d",
            textValue: "Both",
          },
        ],
      },
      {
        fieldName: "heading",
        textValue: "Heading",
        type: FieldType.TEXT,
      },
      {
        fieldName: "description",
        textValue: "Description",
        type: FieldType.LONGTEXT,
        width: 500,
        wordsCnt: 50,
      },
      {
        textValue: "Status",
        type: FieldType.STATUS,
        fieldName: "status",
        statusFormats: [
          {
            value: "IN_ACTIVE",
            bgColor: "#facc15",
            textColor: "#92400e",
            textValue: "Inactive",
          },
          {
            value: "ACTIVE",
            bgColor: "#57fa70",
            textColor: "#024d0d",
            textValue: "Active",
          },
        ],
      },
      {
        textValue: "",
        type: FieldType.CUSTOM,
        CustomComponent: NotificationDetails,
      },
      {
        textValue: "Actions",
        type: FieldType.ACTION,
        actions: notificationActions,
      },
    ],
    isDownload: true,
    title: "Notifications",
    searchColumn: [ "description", "heading",],

    tableHeaderActions: [AddNotify],
  };

  return (
    <AdminDashboardLayout
      active="Notification"
      breadcrumbItems={[
        { label: "Dashboard", link: "/dashboard/Faq" },
        { label: "Notifications", link: "#" },
      ]}
      showSearch={false}
      mainClassName="ml-5"
    >
      <CustomTable {...customTableProps} />
    </AdminDashboardLayout>
  );
}
