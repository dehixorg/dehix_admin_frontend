"use client";

import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/admin/dashboardMenuItems";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";
import { CustomTable } from "../../components/custom-table/CustomTable";
import {
  FieldType,
  FilterDataType,
  Params as TableProps,
} from "@/components/custom-table/FieldTypes";
import { Trash2Icon } from "lucide-react";
import { useToast } from "../../components/ui/use-toast";
import { Messages } from "../../utils/common/enum";
import { apiHelperService } from "../../services/domain";
import AddDomain from "../../components/Domain/addDomain";
import { CustomTableComponent } from "@/components/Domain/CustomTableComponent";

export default function Talent() {
  const { toast } = useToast();

  const handleDelete = async (
    domainId: string,
    refetch: (() => void) | undefined
  ) => {
    try {
      await apiHelperService.deleteDomain(domainId);
      refetch?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: Messages.DELETE_ERROR("domain"),
        variant: "destructive",
      });
    }
  };

  const customTableProps: TableProps = {
    api: "/domain",
    uniqueId: "_id",
    fields: [
      {
        fieldName: "_id",
        textValue: "Domain ID",
        type: FieldType.LONGTEXT,
        wordsCnt: 20,
      },
      {
        fieldName: "label",
        textValue: "Domain Name",
        type: FieldType.TEXT,
      },
      {
        fieldName: "createdAt",
        textValue: "Created At",
        type: FieldType.DATETIME,
      },
      {
        fieldName: "status",
        textValue: "Status",
        type: FieldType.STATUS,
        statusFormats: [
          { textValue: "Active", value: "active", bgColor: "green" },
          { textValue: "Inactive", value: "inactive", bgColor: "red" },
        ],
      },
      {
        textValue: "",
        type: FieldType.ACTION,
        actions: {
          options: [
            {
              actionIcon: <Trash2Icon />,
              actionName: "Delete",
              type: "Button",
              handler: ({ id, refetch }) => handleDelete(id, refetch),
              className: "bg-red-50 text-red-500 hover:bg-red-100 transition",
            },
          ],
        },
      },
      {
        textValue: "",
        type: FieldType.CUSTOM,
        CustomComponent: CustomTableComponent,
      },
    ],
    isDownload: true,
    isFilter: true,
    title: "Domains",
    filterData: [
      {
        name: "label",
        textValue: "Domains",
        type: FilterDataType.MULTI,
        options: [
          { label: "Frontend Development", value: "Frontend" },
          { label: "Game Development", value: "Game Development" },
          { label: "DevOps", value: "DevOps" },
          { label: "Database", value: "Database" },
          { label: "Cybersecurity", value: "Cybersecurity" },
          { label: "Networking", value: "Networking" },
        ],
      },
    ],
    searchColumn: ["label"],
    tableHeaderActions: [AddDomain],
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Domain"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Domain"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard/" },
              { label: "Domain", link: "#" },
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
