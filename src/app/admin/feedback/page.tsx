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
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";

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
    <AdminDashboardLayout
      active="Feedback"
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Feedback", link: "#" },
      ]}
      mainClassName="flex flex-col flex-1 items-start w-full p-4 sm:px-6 sm:py-0 md:gap-8"
      showSearch={false}
    >
      <CustomTable {...customTableProps} />
    </AdminDashboardLayout>
  );
}
