"use client";

import SidebarMenu from "@/components/menu/sidebarMenu";
import Breadcrumb from "@/components/shared/breadcrumbList";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import DropdownProfile from "@/components/shared/DropdownProfile";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/admin/dashboardMenuItems";
import { CustomTable } from "@/components/custom-table/CustomTable";
import { FieldType, Params as TableProps } from "@/components/custom-table/FieldTypes";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Talent() {
  const router = useRouter();

  const customTableProps: TableProps = {
    api: "/project",
    uniqueId: "_id",
    fields: [
      {
        fieldName: "projectName",
        textValue: "Project",
        type: FieldType.TEXT,
      },
      {
        fieldName: "companyName",
        textValue: "Company",
        type: FieldType.TEXT,
      },
      {
        fieldName: "email",
        textValue: "Email",
        type: FieldType.TEXT,
      },
      {
        fieldName: "description",
        textValue: "Description",
        type: FieldType.LONGTEXT,
        wordsCnt: 50,
      },
      {
        fieldName: "skillsRequired",
        textValue: "Skills Required",
        type: FieldType.ARRAY_VALUE,
      },
      {
        fieldName: "status",
        textValue: "Status",
        type: FieldType.STATUS,
        statusFormats: [
          {
            textValue: "Completed",
            value: "COMPLETED",
            bgColor: "#57fa70",
            textColor: "#024d0d",
          },
          {
            textValue: "Pending",
            value: "PENDING",
            bgColor: "yellow",
            textColor: "#525002",
          },
        ],
      },
      {
        textValue: "",
        type: FieldType.ACTION,
        actions: {
          options: [
            {
              actionIcon: <Info />,
              actionName: "View",
              type: "Button",
              handler({ id }) {
                router.push(`/project/tabs?id=${id}`);
              },
            },
          ],
        },
      },
    ],
    title: "Projects",
    isDownload: true,
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Project"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Project"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/business/table" },
              { label: "Project", link: "#" },
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
