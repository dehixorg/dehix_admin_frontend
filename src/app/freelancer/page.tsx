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
import {
  FieldType,
  FilterDataType,
  Params as TableProps,
} from "@/components/custom-table/FieldTypes";
import { ChevronRight, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Flag } from "lucide-react"; // or wherever your icons come from

export default function Talent() {
  const router = useRouter();

  const customTableProps: TableProps = {
    title: "Freelancers",
    uniqueId: "_id",
    api: "/freelancer",
    fields: [
      {
        fieldName: "firstName",
        textValue: "Name",
        type: FieldType.TEXT,
      },
      {
        fieldName: "email",
        textValue: "Email ID",
        type: FieldType.TEXT,
      },
      {
        fieldName: "phone",
        textValue: "Phone No.",
        type: FieldType.TEXT,
        tooltip: true,
        tooltipContent: "Personal Phone Number",
      },
      {
        fieldName: "skills",
        textValue: "Skills",
        type: FieldType.ARRAY_VALUE,
        arrayName: "name",
      },
      {
        fieldName: "domain",
        textValue: "Domains",
        type: FieldType.ARRAY_VALUE,
        arrayName: "name",
      },
      {
        textValue: "",
        type: FieldType.ACTION,
        actions: {
          icon: <ChevronRight className="w-4 h-4" />,
          options: [
            {
              actionName: "View",
              actionIcon: <Info className="text-gray-500 w-4 h-4" />,
              type: "Button",
              handler: (id) => {
                console.log("Id",id)
                router.push(`/freelancer/tabs?id=${id}`);
              },
            },
          ],
        },
      },
    ],
    filterData: [
      {
        name: "skills",
        textValue: "Skills",
        type: FilterDataType.MULTI,
        arrayName: "name",
        options: [
          { label: "React", value: "React" },
          { label: "Vue", value: "Vue" },
          { label: "Django", value: "Django" },
          { label: "Angular", value: "Angular" },
          { label: "Node JS", value: "Node.js" }

        ],
      },
      {
        name: "domain",
        textValue: "Domain",
        arrayName: "name",
        type: FilterDataType.SINGLE,
        options: [
          { label: "Frontend Developer", value: "Frontend" },
          { label: "Backend Developer", value: "Backend" },
          { label: "Full Stack Developer", value: "Fullstack" },
        ],
      },
    ],
    searchColumn: ["skills.name", "email"],
    isDownload: true,
    sortBy: [{ fieldName: "dob", label: "Date Of Birth" }]
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Freelancer"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Freelancer"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "#" },
              { label: "Freelancer", link: "#" },
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <DropdownProfile />
          </div>
        </header>
        <main className="ml-5">
          <CustomTable
            {...customTableProps}
          />
        </main>
      </div>
    </div>
  );
}
