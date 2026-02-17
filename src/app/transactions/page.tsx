// transactions-page-file.tsx (e.g., Transactions.tsx)
"use client";

import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { CustomTable } from "@/components/custom-table/CustomTable";
import { FieldType, FilterDataType, Params as TableProps } from "@/components/custom-table/FieldTypes";

const customTableProps: TableProps = {
  api: "transaction", // API endpoint for transactions
  uniqueId: "_id",
  fields: [
    {
      textValue: "From",
      fieldName: "from",
      type: FieldType.LONGTEXT,
      wordsCnt: 20,
    },
    {
      textValue: "To",
      fieldName: "to",
      type: FieldType.LONGTEXT,
      wordsCnt: 20,
    },
    {
      textValue: "Amount",
      fieldName: "amount",
      type: FieldType.TEXT,
    },
    {
      textValue: "Type",
      fieldName: "type",
      type: FieldType.TEXT,
    },
    {
      textValue: "Reference",
      fieldName: "reference",
      type: FieldType.TEXT,
    },
    {
      textValue: "From Type",
      fieldName: "from_type",
      type: FieldType.TEXT,
    },
    {
      textValue: "Reference ID",
      fieldName: "reference_id",
      type: FieldType.LONGTEXT,
      wordsCnt: 10,
    },
    {
      textValue: "Created At",
      fieldName: "createdAt",
      type: FieldType.LONGTEXT,
      wordsCnt: 20,
    },
  ],
  isDownload: true,
  searchColumn: ["from", "to", "type", "reference","amount"],
  title: "Transactions",
  filterData: [
    {
      name: "type",
      textValue: "Type",
      type: FilterDataType.SINGLE,
      options: [
        { label: "Rewards", value: "rewards," },
        { label: "Payment", value: "payment" },
        { label:'System Generated',value:"system generated"}
      
        // Add more transaction types as needed
      ],
    },
  ],
};

export default function Transactions() {
  return (
    <AdminDashboardLayout
      active="Transactions"
      breadcrumbItems={[
        { label: "Dashboard", link: "/dashboard/" },
        { label: "Transactions", link: "#" },
      ]}
      showSearch={false}
      mainClassName="ml-5"
    >
      <CustomTable {...customTableProps} />
    </AdminDashboardLayout>
  );
}