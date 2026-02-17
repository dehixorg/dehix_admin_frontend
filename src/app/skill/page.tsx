"use client";

import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { CustomTable } from "@/components/custom-table/CustomTable";
import {
  FieldType,
  FilterDataType,
  Params as TableProps,
} from "@/components/custom-table/FieldTypes";
import AddSkill from "@/components/skill/addskill";
import { SkillDetails } from "@/components/skill/SkillDetail";

export default function Talent() {
  const customTableProps: TableProps = {
    api: "/skills/admin",
    uniqueId: "_id",
    fields: [
      {
        fieldName: "_id",
        textValue: "Skill ID",
        type: FieldType.LONGTEXT,
        wordsCnt: 20,
      },
      {
        fieldName: "label",
        textValue: "Skill",
        type: FieldType.TEXT,
      },
      {
        fieldName: "description",
        textValue: "Description",
        type: FieldType.LONGTEXT,
        wordsCnt: 50,
      },
      {
        fieldName: "status",
        textValue: "Status",
        type: FieldType.STATUS,
        statusFormats: [
          {
            textValue: "Active",
            value: "active",
            bgColor: "#57fa70",
            textColor: "#024d0d",
          },
          {
            value: "inactive",
            bgColor: "yellow",
            textColor: "#525002",
            textValue: "Inactive",
          },
        ],
      },
      {
        fieldName: "createdBy",
        textValue: "Created By",
        type: FieldType.STATUS,
        statusFormats: [
          {
            textValue: "Admin",
            value: "ADMIN",
            bgColor: "#3b82f6",
            textColor: "#ffffff",
          },
          {
            textValue: "Freelancer",
            value: "FREELANCER",
            bgColor: "#ec4899",
            textColor: "#ffffff",
          },
        ],
      },
      {
        fieldName: "createdById",
        textValue: "Created By ID",
        type: FieldType.TEXT,
      },
      {
        textValue: "",
        type: FieldType.CUSTOM,
        CustomComponent: SkillDetails,
      },
    ],
    searchColumn: ["label"],
    filterData: [
      {
        name: "status",
        textValue: "Status",
        type: FilterDataType.SINGLE,
        options: [
          { label: "Active", value: "active,Active,ACTIVE" },
          { label: "Inactive", value: "inactive,Inactive,INACTIVE" },
        ],
      },
      {
        name: "createdBy",
        textValue: "Created By",
        type: FilterDataType.SINGLE,
        options: [
          { label: "Admin", value: "ADMIN" },
          { label: "Freelancer", value: "FREELANCER" },
        ],
      },
    ],
    isDownload: true,
    title: "Skills",
    tableHeaderActions: [AddSkill],
  };

  return (
    <AdminDashboardLayout
      active="Skill"
      breadcrumbItems={[
        { label: "Dashboard", link: "/dashboard/" },
        { label: "Skill", link: "#" },
      ]}
      showSearch={false}
      mainClassName="ml-5"
    >
      <CustomTable {...customTableProps} />
    </AdminDashboardLayout>
  );
}
