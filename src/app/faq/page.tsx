"use client";

import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { CustomTable } from "@/components/custom-table/CustomTable";
import {
  FieldType,
  FilterDataType,
  Params as TableProps,
} from "@/components/custom-table/FieldTypes";
import AddFaq from "@/components/Faq/addFaq";
import { FaqDetails } from "@/components/Faq/FaqDetails";

const customTableProps: TableProps = {
  api: "/faq",
  uniqueId: "_id",
  fields: [
    {
      fieldName: "type",
      textValue: "Type",
      type: FieldType.STATUS,
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
      ],
    },
    {
      fieldName: "status",
      textValue: "Status",
      type: FieldType.STATUS,
      statusFormats: [
        {
          value: "INACTIVE",
          bgColor: "yellow",
          textColor: "#525002",
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
      fieldName: "question",
      textValue: "Question",
      type: FieldType.LONGTEXT,
    },
    {
      fieldName: "answer",
      textValue: "Answer",
      type: FieldType.LONGTEXT,
    },
    {
      fieldName: "importantUrl",
      textValue: "URL Count",
      type: FieldType.LENGTH,
    },
    {
      textValue: "",
      type: FieldType.CUSTOM,
      CustomComponent: FaqDetails
    },
  ],
  searchColumn: ["question", "answer"],
  tableHeaderActions: [AddFaq],
  filterData: [
    {
      name: "status",
      textValue: "Status",
      type: FilterDataType.SINGLE,
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
      ],
    },
    {
      name: "type",
      textValue: "Type",
      type: FilterDataType.SINGLE,
      options: [
        { label: "Freelancer", value: "FREELANCER" },
        { label: "Business", value: "BUSINESS" },
      ],
    },
  ],
  title: "Faqs",
};

export default function Talent() {
  return (
    <AdminDashboardLayout
      active="Faq"
      breadcrumbItems={[
        { label: "Dashboard", link: "/dashboard/Faq" },
        { label: "Faq", link: "#" },
      ]}
      showSearch={false}
      mainClassName="ml-5 mr-3"
    >
      <CustomTable {...customTableProps} />
    </AdminDashboardLayout>
  );
}
