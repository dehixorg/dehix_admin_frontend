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
import {
  FieldType,
  Params as TableProps,
} from "@/components/custom-table/FieldTypes";
import AddNotify from "@/components/Notification/addNotify";
import { NotificationDetails } from "@/components/Notification/NotificationDetails";

export default function Talent() {
  const customTableProps: TableProps = {
    api: "/ads",
    uniqueId: "_id",
    fields: [
      {
        textValue: "Type",
        type: FieldType.STATUS,
        fieldName: "type",
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
          {
            value: "BOTH",
            bgColor: "#57fa70",
            textColor: "#024d0d",
            textValue: "Both",
          },
        ],
      },
      {
        fieldName: "heading",
        textValue: "Heading",
        type: FieldType.TEXT,
      },
      {
        fieldName: "description",
        textValue: "Description",
        type: FieldType.LONGTEXT,
        width: 500,
        wordsCnt: 50,
      },
      {
        textValue: "Status",
        type: FieldType.STATUS,
        fieldName: "status",
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
        textValue: "",
        type: FieldType.CUSTOM,
        CustomComponent: NotificationDetails
      },
    ],
    isDownload: true,
    title: "Notifications",
    tableHeaderActions: [AddNotify],
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Notification"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Notification"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard/Faq" },
              { label: "Notifications", link: "#" },
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <DropdownProfile />
          </div>
        </header>
        <main className="ml-5">
          {/* <NotifyTable /> */}
          <CustomTable {...customTableProps} />
        </main>
      </div>
    </div>
  );
}
