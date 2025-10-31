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
  CustomComponentProps,
  FieldType,
  FilterDataType,
  Params as TableProps,
} from "@/components/custom-table/FieldTypes";
import { CustomDialog } from "../../components/CustomDialog";
import { useState } from "react";
import EditSkillDescription from "@/components/skill/editSkilldesc";
import AddSkill from "@/components/skill/addskill";
import { SkillDetails } from "@/components/skill/SkillDetail";

export default function Talent() {
  const customTableProps: TableProps = {
    api: "/skills",
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
        textValue: "",
        type: FieldType.CUSTOM,
        CustomComponent: SkillDetails
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
    ],
    isDownload: true,
    title: "Skills",
    tableHeaderActions: [AddSkill],
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Skill"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Skill"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard/" },
              { label: "Skill", link: "#" },
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
