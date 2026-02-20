// connects-page-file.tsx (e.g., Connects.tsx)
"use client";

import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { CustomTable } from "@/components/custom-table/CustomTable";
import { FieldType, FilterDataType, Params as TableProps } from "@/components/custom-table/FieldTypes";
// Import the new component
import { ConnectsDetails } from "@/components/connects/ConnectsDetails";

const customTableProps: TableProps = {
  api: "token-request",
  uniqueId: "_id",
  fields: [
    {
      textValue: "User ID",
      fieldName: "userId",
      type: FieldType.LONGTEXT,
      wordsCnt: 20,
      copyable: true,
    },
    {
      textValue: "User Type",
      fieldName: "userType",
      type: FieldType.TEXT,
    },
    {
      textValue: "Amount",
      fieldName: "amount",
      type: FieldType.CURRENCY,
    },
    {
      textValue: "Status",
      fieldName: "status",
      type: FieldType.STATUS,
      statusFormats: [
        {
          textValue: "Approved",
          value: "APPROVED",
          bgColor: "#57fa70",
          textColor: "#024d0d",
        },
        {
          textValue: "Pending",
          value: "PENDING",
          bgColor: "yellow",
          textColor: "#525002",
        },
        {
          textValue: "Rejected",
          value: "REJECTED",
          bgColor: "red",
          textColor: "black",
        },
      ],
    },
    {
      textValue: "Created At",
      fieldName: "createdAt",
      type: FieldType.LONGTEXT,
      wordsCnt: 20,
    },
    {
      textValue: "Updated At",
      fieldName: "updatedAt",
      type: FieldType.LONGTEXT,
      wordsCnt: 20,
    },
    // The corrected custom column for the action button
    {
      textValue: "Actions", // The header for your action column
      type: FieldType.CUSTOM,
      CustomComponent: ConnectsDetails, // The component that renders the button
    },
  ],
  isDownload: true,
  searchColumn: ["userId", "userType", "status"],
  title: "Connects",
  filterData: [
    {
      name: "status",
      textValue: "Status",
      type: FilterDataType.SINGLE,
      options: [
        { label: "Approved", value: "APPROVED" },
        { label: "Pending", value: "PENDING" },
        { label: "Rejected", value: "REJECTED" },
      ],
    },
  ],
};

export default function Connects() {
  return (
    <AdminDashboardLayout
      active="Connects"
      breadcrumbItems={[
        { label: "Dashboard", link: "/dashboard/" },
        { label: "Connects", link: "#" },
      ]}
      showSearch={false}
      mainClassName="ml-5"
    >
      <CustomTable {...customTableProps} />
    </AdminDashboardLayout>
  );
}