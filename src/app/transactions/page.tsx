// transactions-page-file.tsx (e.g., Transactions.tsx)
"use client";

import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/admin/dashboardMenuItems";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";
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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Transactions" // Update active menu item
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="transactions" // Update active menu item
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard/" },
              { label: "Transactions", link: "#" }, // Update breadcrumb label
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <DropdownProfile />
          </div>
        </header>
        <main className="ml-5">
          <CustomTable {...customTableProps} />
        </main>
      </div>
    </div>
  );
}