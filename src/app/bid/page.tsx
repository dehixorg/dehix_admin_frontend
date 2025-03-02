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
import { FieldType, Params as TableProps } from "@/components/custom-table/FieldTypes";

const customTableProps: TableProps = {
  api: "bid",
  uniqueId: "_id",
  fields: [
    {
      textValue: "Project ID",
      fieldName: "project_id",
      type: FieldType.LONGTEXT,
      wordsCnt: 20,
    },
    {
      textValue: "Bidder ID",
      fieldName: "bidder_id",
      type: FieldType.LONGTEXT,
      wordsCnt: 10,
    },
    {
      textValue: "Current Price",
      fieldName: "current_price",
      type: FieldType.CURRENCY,
    },
    {
      textValue: "Description",
      fieldName: "description",
      type: FieldType.LONGTEXT,
    },
    {
      textValue: "Status",
      fieldName: "bid_status",
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
  ],
  isDownload: true,
};

export default function Talent() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Bid"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="bid"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard/" },
              { label: "Bid ", link: "#" },
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
