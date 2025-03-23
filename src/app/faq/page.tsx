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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Faq"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Faq"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard/Faq" },
              { label: "Faq", link: "#" },
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <DropdownProfile />
          </div>
        </header>
        <main className="ml-5 mr-3">
          {/* <FaqTable /> */}
          <CustomTable {...customTableProps} />
        </main>
      </div>
    </div>
  );
}
