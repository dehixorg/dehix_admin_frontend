"use client";

import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { CustomTable } from "@/components/custom-table/CustomTable";
import { FieldType, Params as TableProps } from "@/components/custom-table/FieldTypes";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Talent() {
  const router = useRouter();

  const customTableProps: TableProps = {
    api: "/project",
    uniqueId: "_id",
    fields: [
      {
        fieldName: "projectName",
        textValue: "Project",
        type: FieldType.TEXT,
      },
      {
        fieldName: "companyName",
        textValue: "Company",
        type: FieldType.TEXT,
      },
      {
        fieldName: "email",
        textValue: "Email",
        type: FieldType.TEXT,
      },
      {
        fieldName: "description",
        textValue: "Description",
        type: FieldType.LONGTEXT,
        wordsCnt: 50,
      },
      {
        fieldName: "skillsRequired",
        textValue: "Skills Required",
        type: FieldType.ARRAY_VALUE,
      },
      {
        fieldName: "status",
        textValue: "Status",
        type: FieldType.STATUS,
        statusFormats: [
          {
            textValue: "Pending",
            value: "PENDING",
            bgColor: "#fef3c7",
            textColor: "#92400e",
          },
          {
            textValue: "Active",
            value: "ACTIVE",
            bgColor: "#d1fae5",
            textColor: "#065f46",
          },
          {
            textValue: "Rejected",
            value: "REJECTED",
            bgColor: "#fee2e2",
            textColor: "#991b1b",
          },
          {
            textValue: "Completed",
            value: "COMPLETED",
            bgColor: "#dbeafe",
            textColor: "#1e40af",
          },
        ],
      },
      {
        textValue: "",
        type: FieldType.ACTION,
        actions: {
          options: [
            {
              actionIcon: <Info />,
              actionName: "View",
              type: "Button",
              handler({ id }) {
                router.push(`/project/tabs?id=${id}`);
              },
            },
          ],
        },
      },
      
    ],
    title: "Projects",
    isDownload: true,
    searchColumn: ["id","projectName", "companyName", "email",],
  };

  return (
    <AdminDashboardLayout
      active="Project"
      breadcrumbItems={[
        { label: "Dashboard", link: "/business/table" },
        { label: "Project", link: "#" },
      ]}
      showSearch={false}
      mainClassName="ml-5"
    >
      <CustomTable {...customTableProps} />
    </AdminDashboardLayout>
  );
}
