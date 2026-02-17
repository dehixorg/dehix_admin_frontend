"use client";
import { ChevronRight, Info } from "lucide-react";

import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { FieldType, FilterDataType, Params as TableProps } from "@/components/custom-table/FieldTypes";
import { useRouter } from "next/navigation";
import { CustomTable } from "@/components/custom-table/CustomTable";

export default function Talent() {
  const router = useRouter();

  const customTableProps: TableProps = {
    title: "Businesses",
    uniqueId: "_id",
    api: "/business/all",
    fields: [
      {
        fieldName: "firstName",
        textValue: "Name",
        type: FieldType.TEXT,
      },
      {
        fieldName: "email",
        textValue: "Email ID",
        type: FieldType.TEXT,
      },
      {
        fieldName: "phone",
        textValue: "Phone No.",
        type: FieldType.TEXT,
        tooltip: true,
        tooltipContent: "Personal Phone Number",
      },
      {
        fieldName: "companyName",
        textValue: "Company",
        type: FieldType.TEXT,
      },
      {
        fieldName: "status",
        textValue: "Status",
        type: FieldType.STATUS,
        statusFormats: [
          {
            value: "ACTIVE",
            textValue: "Active",
          },
          {
            value: "NOT_VERIFIED",
            textValue: "Not Verified",
          },
          {
            value: "Not_Verified",
            textValue: "Not Verified",
          },
          {
            value: "Notverified",
            textValue: "Not Verified",
          },
        ],
      },
      {
        textValue: "",
        type: FieldType.ACTION,
        actions: {
          icon: <ChevronRight className="h-4 w-4" />,
          options: [
            {
              actionName: "View",
              actionIcon: <Info className="h-4 w-4 text-gray-500" />,
              type: "Button",
              handler: ({ id }) => {
                router.push(`/business/tabs?id=${id}`);
              },
            },
          ],
        },
      },
    ],
    filterData: [
      {
        name: "status",
        textValue: "Status",
        type: FilterDataType.SINGLE,
        options: [
          { label: "ACTIVE", value: "ACTIVE" },
          { label: "NOT VERIFIED", value: "Not_Verified,Notverified,NOT_VERIFIED" },
        ],
      },
    ],
    searchColumn: ["firstName", "email", "companyName", "status"],
    isDownload: true,
    sortBy: [{ fieldName: "dob", label: "Date Of Birth" }],
  };

  return (
    <AdminDashboardLayout
      active="Business"
      breadcrumbItems={[{ label: "Business", link: "#" }]}
      showSearch={false}
      mainClassName="ml-5"
    >
      <CustomTable {...customTableProps} />
    </AdminDashboardLayout>
  );
}
