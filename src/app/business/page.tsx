"use client";
import { ChevronRight, Info } from "lucide-react";

import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/admin/dashboardMenuItems";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";
import { FieldType, FilterDataType, Params as TableProps } from "@/components/custom-table/FieldTypes";
import { useRouter } from "next/navigation";
import { CustomTable } from "@/components/custom-table/CustomTable";

export default function Talent() {
  const router = useRouter()

  const customTableProps: TableProps = {
    title: "Businesses",
              uniqueId: "_id",
              api: "/business/all",
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
                  fieldName: "companyName",
                  textValue: "Company",
                  type: FieldType.TEXT,
                },
                {
                  fieldName: "status",
                  textValue: "Status",
                  type: FieldType.STATUS,
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
                          router.push(`/business/tabs?id=${id.id}`);
                        },
                      },
                     
                    ],
                  },
                },
              ],
              filterData: [
                {
                  name: "status",
                  textValue: "Status",
                  type: FilterDataType.SINGLE,
                  
                  options: [
                    { label: "ACTIVE", value: "ACTIVE" },
                    { label: "NOT VERIFIED", value: "Not_Verified,Notverified,NOT_VERIFIED" },
                  ],
                },
                
              ],
              searchColumn: ["firstName", "email", "companyName"],
              isDownload: true,
              sortBy: [{ fieldName: "dob", label: "Date Of Birth" }]
  }
  

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Business"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Business"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard/" },
              { label: "Business ", link: "#" },
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
