"use client";

import { CustomTable } from "@/components/custom-table/CustomTable";
import {
  CustomComponentProps,
  FieldType,
  Params as TableProps,
} from "@/components/custom-table/FieldTypes";
import AddFeedbackCampaign from "@/components/Feedback/AddFeedbackCampaign";
import ViewSubmissions from "@/components/Feedback/ViewSubmissions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import { useRouter } from "next/navigation";
import SidebarMenu from "@/components/menu/sidebarMenu";
import { menuItemsBottom, menuItemsTop } from "@/config/menuItems/admin/dashboardMenuItems";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";

export default function FeedbackPage() {
  const router = useRouter();
  
  const customTableProps: TableProps = {
    api: "/admin/feedback/campaign",
    uniqueId: "_id",
    fields: [
      {
        fieldName: "title",
        textValue: "Title",
        type: FieldType.TEXT,
      },
      {
        fieldName: "description",
        textValue: "Description",
        type: FieldType.LONGTEXT,
        wordsCnt: 20,
      },
      {
        fieldName: "targetAudience",
        textValue: "Target Audience",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data }: CustomComponentProps) => {
          if (!data) return <span>-</span>;
          const userType = data.targetAudience?.userType ?? "N/A";
          const colors: Record<string, string> = {
            FREELANCER: "bg-blue-100 text-blue-800",
            BUSINESS: "bg-green-100 text-green-800",
            ALL: "bg-purple-100 text-purple-800",
          };
          return <Badge className={colors[userType]}>{userType}</Badge>;
        },
      },
      {
        fieldName: "status",
        textValue: "Status",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data }: CustomComponentProps) => {
          if (!data) return <span>-</span>;
          if (data.isArchived) {
            return <Badge variant="destructive">Archived</Badge>;
          }
          return data.isActive ? (
            <Badge className="bg-green-500">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          );
        },
      },
      {
        fieldName: "questions",
        textValue: "Questions",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data }: CustomComponentProps) => {
          if (!data) return <span>0</span>;
          return <span>{data.questions?.length || 0}</span>;
        },
      },
      {
        fieldName: "submissions",
        textValue: "Submissions",
        type: FieldType.CUSTOM,
        CustomComponent: ({ id }: CustomComponentProps) => {
          return <ViewSubmissions campaignId={id} />;
        },
      },
      {
        fieldName: "actions",
        textValue: "Actions",
        type: FieldType.CUSTOM,
        CustomComponent: ({ id }: CustomComponentProps) => {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/admin/feedback/${id}`)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          );
        },
      },
    ],
    tableHeaderActions: [AddFeedbackCampaign],
    isDownload: false,
    searchColumn: ["title", "description"],
    title: "Feedback Campaigns",
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Feedback"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Feedback"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/admin" },
              { label: "Feedback", link: "#" },
            ]}
          />
          <div className="ml-auto">
            <DropdownProfile />
          </div>
        </header>
        <main className="flex flex-col flex-1 items-start w-full p-4 sm:px-6 sm:py-0 md:gap-8">
          <CustomTable {...customTableProps} />
        </main>
      </div>
    </div>
  );
}
