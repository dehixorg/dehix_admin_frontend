// connects-page-file.tsx (e.g., Connects.tsx)
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
          textValue: "Accepted",
          value: "ACCEPTED",
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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Connects"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="connects"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard/" },
              { label: "Connects", link: "#" },
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