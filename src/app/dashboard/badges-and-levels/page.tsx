"use client";

import { useState } from "react";
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
import { Eye, Edit, Trash2, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BadgeLevelDetails } from "@/components/BadgesLevels/BadgeLevelDetails";
import EditBadgeLevel from "@/components/BadgesLevels/editBadgeLevel";
import DeleteBadgeLevel from "@/components/BadgesLevels/deleteBadgeLevel";
import { axiosInstance } from "@/lib/axiosinstance";

export default function BadgesAndLevels() {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const handleRefetch = () => {
    setTableKey((prev) => prev + 1);
  };

  const fetchRowData = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/admin/gamification/levelsandbadges/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching row data:", error);
      return null;
    }
  };

  const customTableProps: TableProps = {
    api: "/admin/gamification/levelsandbadges",
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
        textValue: "",
        type: FieldType.CUSTOM,
        CustomComponent: ({ id, data, refetch }: any) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedRow(data);
                    setDetailsOpen(true);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedRow(data);
                    setEditOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedRow(data);
                    setDeleteOpen(true);
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    searchColumn: ["name", "description", "type", "isActive"],
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
          <CustomTable key={tableKey} {...customTableProps} />
        </main>
      </div>

      {/* Dialogs controlled by state */}
      {selectedRow && (
        <>
          <BadgeLevelDetails
            id={selectedRow._id}
            data={selectedRow}
            refetch={handleRefetch}
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
          />
          <EditBadgeLevel
            data={selectedRow}
            refetch={handleRefetch}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <DeleteBadgeLevel
            data={selectedRow}
            refetch={handleRefetch}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      )}
    </div>
  );
}
