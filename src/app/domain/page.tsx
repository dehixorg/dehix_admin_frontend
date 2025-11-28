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
import { Trash2Icon } from "lucide-react";
import { useToast } from "../../components/ui/use-toast";
import { Messages } from "../../utils/common/enum";
import { apiHelperService } from "../../services/domain";
import { CustomTableComponent } from "@/components/Domain/CustomTableComponent";
import AddDomain from "@/components/Domain/addDomain";

export default function DomainPage() {
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
    searchColumn: ["label"],
    isDownload: true,
    title: "Domains",
    tableHeaderActions: [AddDomain],
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
