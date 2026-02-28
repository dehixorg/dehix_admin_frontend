"use client";

import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { CustomTable } from "@/components/custom-table/CustomTable";
import {
  CustomComponentProps,
  FieldType,
  FilterDataType,
  Params as TableProps,
} from "@/components/custom-table/FieldTypes";
import AddAdmin from "@/components/Admin/addAdmin";
import { CustomDialog } from "@/components/CustomDialog";
import { AdminDetails } from "@/components/Admin/AdminDetails";

const customTableProps: TableProps = {
  api: "/admin",
  uniqueId: "_id",
  fields: [
    {
      textValue: "Type",
      fieldName: "type",
      type: FieldType.STATUS,
      statusFormats: [
        {
          textValue: "Admin",
          value: "ADMIN",
          bgColor: "#5bbcfc",
          textColor: "#031f5c",
        },
        {
          textValue: "Super Admin",
          value: "SUPER_ADMIN",
          bgColor: "#fc88c0",
          textColor: "#5c0328",
        },
      ],
    },
    {
      textValue: "Name",
      type: FieldType.CUSTOM,
      CustomComponent: ({ data }: CustomComponentProps) => {
        return (
          <span>
            {data.firstName} {data.lastName}
          </span>
        );
      },
    },
    {
      fieldName: "userName",
      textValue: "Username",
      type: FieldType.TEXT,
    },
    {
      fieldName: "email",
      textValue: "Email",
      type: FieldType.TEXT,
    },
    {
      fieldName: "phone",
      textValue: "Phone Number",
      type: FieldType.TEXT,
    },
    {
      textValue: "Status",
      fieldName: "status",
      type: FieldType.STATUS,
      statusFormats: [
        {
          textValue: "Accepted",
          value: "ACCEPTED",
          bgColor: "#2dfc2d",
          textColor: "#014d01",
        },
        {
          textValue: "Pending",
          value: "PENDING",
          bgColor: "#eaf001",
          textColor: "#717501",
        },
        {
          textValue: "Paused",
          value: "PAUSED",
          bgColor: "#eaf001",
          textColor: "#717501",
        },
        {
          textValue: "Rejected",
          value: "REJECTED",
          bgColor: "#fc4b4b",
          textColor: "#5c0000",
        },
      ],
    },
    {
      textValue: "",
      type: FieldType.CUSTOM,
      CustomComponent: ({ data, refetch }: CustomComponentProps) => {
        return (
          <CustomDialog
            title={"Admin Details"}
            description={"Detailed information about the Admin."}
            content={
              <AdminDetails data={data} refetch={refetch} />
            }
          />
        );
      },
    },
  ],
  tableHeaderActions: [AddAdmin],
  isDownload: true,
  searchColumn: ["firstName", "lastName", "userName", "email", "phone"],
  title: "Admins",
  filterData: [
    {
      name: "status",
      textValue: "Status",
      type: FilterDataType.SINGLE,
      options: [
        { label: "Accepted", value: "ACCEPTED" },
        { label: "Pending", value: "PENDING" },
        { label: "Paused", value: "PAUSED" },
        { label: "Rejected", value: "REJECTED" },
      ],
    },
  ],
};

export default function Talent() {
  return (
    <AdminDashboardLayout
      active="Admin"
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Admin", link: "#" },
      ]}
      showSearch={false}
      mainClassName="ml-5 mr-3"
    >
      <CustomTable {...customTableProps} />
    </AdminDashboardLayout>
  );
}
