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
  FilterDataType,
  Params as TableProps,
} from "@/components/custom-table/FieldTypes";
import AddBadgeLevel from "@/components/BadgesLevels/addBadgeLevel";
import { BadgeLevelDetails } from "@/components/BadgesLevels/BadgeLevelDetails";

const customTableProps: TableProps = {
  api: "/admin/gamification/definition",
  uniqueId: "_id",
  fields: [
    {
      fieldName: "type",
      textValue: "Type",
      type: FieldType.STATUS,
      statusFormats: [
        {
          value: "BADGE",
          bgColor: "#7c82f2",
          textColor: "#03085e",
          textValue: "Badge",
        },
        {
          value: "LEVEL",
          bgColor: "#10b981",
          textColor: "#064e3b",
          textValue: "Level",
        },
      ],
    },
    {
      fieldName: "isActive",
      textValue: "Status",
      type: FieldType.STATUS,
      statusFormats: [
        {
          value: "false",
          bgColor: "yellow",
          textColor: "#525002",
          textValue: "Inactive",
        },
        {
          value: "true",
          bgColor: "#57fa70",
          textColor: "#024d0d",
          textValue: "Active",
        },
      ],
    },
    {
      fieldName: "name",
      textValue: "Name",
      type: FieldType.LONGTEXT,
    },
    {
      fieldName: "description",
      textValue: "Description",
      type: FieldType.LONGTEXT,
    },
    {
      fieldName: "imageUrl",
      textValue: "Image URL",
      type: FieldType.LENGTH,
    },
    {
      textValue: "",
      type: FieldType.CUSTOM,
      CustomComponent: BadgeLevelDetails
    },
  ],
  searchColumn: ["name", "description"],
  tableHeaderActions: [AddBadgeLevel],
  filterData: [
    {
      name: "isActive",
      textValue: "Status",
      type: FilterDataType.SINGLE,
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
    {
      name: "type",
      textValue: "Type",
      type: FilterDataType.MULTI,
      options: [
        { label: "Badge", value: "BADGE" },
        { label: "Level", value: "LEVEL" },
      ],
    },
  ],
  title: "Badges & Levels",
};

export default function BadgesAndLevels() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Badges & Levels"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Badges & Levels"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard/badges-and-levels" },
              { label: "Badges & Levels", link: "#" },
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <DropdownProfile />
          </div>
        </header>
        <main className="ml-5 mr-3">
          <CustomTable {...customTableProps} />
        </main>
      </div>
    </div>
  );
}
