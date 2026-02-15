"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CustomTable } from "@/components/custom-table/CustomTable";
import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import DropdownProfile from "@/components/shared/DropdownProfile";
import Breadcrumb from "@/components/shared/breadcrumbList";
import {
  menuItemsTop,
  menuItemsBottom,
} from "@/config/menuItems/admin/dashboardMenuItems";
import {
  FieldType,
  FilterDataType,
} from "@/components/custom-table/FieldTypes";
import { Info, MessageSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AllReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "reports";

  const handleTabChange = (value: string) => {
    router.push(`/reports?tab=${value}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Sidebar */}
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Reports"
      />

      {/* Content */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Reports"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Reports", link: "/reports/all" },
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <DropdownProfile />
          </div>
        </header>

        {/* Table */}
        <div className="px-4 sm:px-6">
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="reported-messages">
                <MessageSquare className="w-4 h-4 mr-2" />
                Reported Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="mt-4">
              <CustomTable
                title="Reports"
                uniqueId="_id"
                api="/reports"
                fields={[
                  {
                    fieldName: "_id",
                    textValue: "Report ID",
                    type: FieldType.TEXT,
                  },
                  {
                    fieldName: "subject",
                    textValue: "Subject",
                    type: FieldType.TEXT,
                  },
                  {
                    fieldName: "description",
                    textValue: "Description",
                    type: FieldType.TEXT,
                  },
                  {
                    fieldName: "report_type",
                    textValue: "Report Type",
                    type: FieldType.TEXT,
                  },
                  {
                    fieldName: "report_role",
                    textValue: "Role",
                    type: FieldType.TEXT,
                  },
                  {
                    fieldName: "status",
                    textValue: "Status",
                    type: FieldType.TEXT,
                  },
                  {
                    textValue: "Action",
                    type: FieldType.ACTION,
                    actions: {
                      icon: <Info className="w-4 h-4" />,
                      options: [
                        {
                          actionName: "View",
                          actionIcon: (
                            <Info className="text-blue-500 w-4 h-4" />
                          ),
                          type: "Button",
                          handler: (row) => {
                            router.push(`/reports/view?id=${row.id}`);
                          },
                        },
                      ],
                    },
                  },
                ]}
                searchColumn={[
                  "subject",
                  "description",
                  "report_type",
                  "status",
                ]}
                isDownload={true}
                filterData={[
                  {
                    name: "report_type",
                    textValue: "Report Type",
                    type: FilterDataType.SINGLE,
                    options: [
                      { label: "Freelancer", value: "Freelancer" },
                      { label: "Business", value: "Business" },
                    ],
                  },
                  {
                    name: "status",
                    textValue: "Status",
                    type: FilterDataType.SINGLE,
                    options: [
                      { label: "Open", value: "OPEN" },
                      { label: "Closed", value: "CLOSED" },
                    ],
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="reported-messages" className="mt-4">
              <CustomTable
                title="Reported Messages"
                uniqueId="_id"
                api="/admin/reported-messages"
                fields={[
                  {
                    fieldName: "_id",
                    textValue: "Report ID",
                    type: FieldType.TEXT,
                  },
                  {
                    fieldName: "messageSenderUserName",
                    textValue: "Message Sender",
                    type: FieldType.TEXT,
                  },
                  {
                    fieldName: "reportedByUserName",
                    textValue: "Reported By",
                    type: FieldType.TEXT,
                  },
                  {
                    fieldName: "messageContent",
                    textValue: "Message Content",
                    type: FieldType.LONGTEXT,
                    wordsCnt: 30,
                  },
                  {
                    fieldName: "status",
                    textValue: "Status",
                    type: FieldType.TEXT,
                  },
                  {
                    fieldName: "createdAt",
                    textValue: "Reported At",
                    type: FieldType.DATE,
                  },
                  {
                    textValue: "Action",
                    type: FieldType.ACTION,
                    actions: {
                      icon: <Info className="w-4 h-4" />,
                      options: [
                        {
                          actionName: "View",
                          actionIcon: (
                            <Info className="text-blue-500 w-4 h-4" />
                          ),
                          type: "Button",
                          handler: (row: any) => {
                            const id = row._id || row.id || (row as any)._id;
                            router.push(`/reports/reported-messages?id=${id}`);
                          },
                        },
                      ],
                    },
                  },
                ]}
                searchColumn={[
                  "messageContent",
                  "messageSenderUserName",
                  "reportedByUserName",
                  "status",
                ]}
                isDownload={true}
                filterData={[
                  {
                    name: "status",
                    textValue: "Status",
                    type: FilterDataType.SINGLE,
                    options: [
                      { label: "Open", value: "OPEN" },
                      { label: "Chat Enabled", value: "IN_PROGRESS" },
                      { label: "Closed", value: "CLOSED" },
                    ],
                  },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
