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
import { ChevronRight, CheckCircle, XCircle, Clock } from "lucide-react";
import { kycApiService } from "@/services/kyc";
import { useToast } from "@/components/ui/use-toast";
import { Messages } from "@/utils/common/enum";

export default function KYCPage() {
  const { toast } = useToast();

  const handleUpdateStatus = async (id: string, status: string, role: string) => {
    console.log('Updating KYC status for ID:', id, 'to status:', status, 'role:', role);
    try {
      const response = await kycApiService.updateKYCStatus(id, status, role);
      console.log('Update response:', response);
      
      if (response.success) {
        toast({
          title: "Success",
          description: Messages.UPDATE_SUCCESS("KYC status"),
          variant: "default",
        });
        // Refresh the table
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: Messages.UPDATE_ERROR("KYC status"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.UPDATE_ERROR("KYC status"),
        variant: "destructive",
      });
    }
  };

  const customTableProps: TableProps = {
    title: "KYC Requests",
    uniqueId: "_id",
    api: "/kyc",
    fields: [
      {
        textValue: "User Type",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data }: { data: any }) => {
          const userType = data.role || data.userType || data.user_type || "-";
          return <span className="capitalize">{userType}</span>;
        },
        tooltip: true,
        tooltipContent: "Type of user (Business/Freelancer)",
      },
      {
        fieldName: "userId",
        textValue: "User ID",
        type: FieldType.TEXT,
      },
      {
        textValue: "Document Type",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data }: { data: any }) => {
          const docType = data.documentType || "-";
          return <span>{docType}</span>;
        },
      },
      {
        textValue: "Submitted At",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data }: { data: any }) => {
          const submittedAt = data.submittedAt || data.createdAt || "-";
          if (submittedAt === "-") return <span>-</span>;
          const date = new Date(submittedAt);
          return <span>{date.toLocaleDateString()}</span>;
        },
      },
      {
        fieldName: "status",
        textValue: "Status",
        type: FieldType.STATUS,
        statusFormats: [
          {
            value: "PENDING",
            textValue: "Pending",
            bgColor: "#fef3c7",
            textColor: "#92400e",
            isUppercase: true,
          },
          {
            value: "VERIFIED",
            textValue: "Verified",
            bgColor: "#d1fae5",
            textColor: "#065f46",
            isUppercase: true,
          },
          {
            value: "REUPLOAD",
            textValue: "Reupload",
            bgColor: "#fed7aa",
            textColor: "#92400e",
            isUppercase: true,
          },
          {
            value: "STOPPED",
            textValue: "Stopped",
            bgColor: "#fee2e2",
            textColor: "#991b1b",
            isUppercase: true,
          },
          {
            value: "APPLIED",
            textValue: "Applied",
            bgColor: "#dbeafe",
            textColor: "#1e40af",
            isUppercase: true,
          },
        ],
      },
      {
        textValue: "Actions",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data, refetch }: { data: any; refetch?: () => void }) => {
          const role = data.role || "";
          const id = data._id;
          
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateStatus(id, "VERIFIED", role)}
                className="text-green-600 hover:text-green-800 p-1 rounded transition"
                title="Verify"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleUpdateStatus(id, "REUPLOAD", role)}
                className="text-orange-600 hover:text-orange-800 p-1 rounded transition"
                title="Request Reupload"
              >
                <XCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleUpdateStatus(id, "STOPPED", role)}
                className="text-red-600 hover:text-red-800 p-1 rounded transition"
                title="Stop"
              >
                <XCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleUpdateStatus(id, "PENDING", role)}
                className="text-yellow-600 hover:text-yellow-800 p-1 rounded transition"
                title="Set Pending"
              >
                <Clock className="w-4 h-4" />
              </button>
            </div>
          );
        },
      },
    ],
    filterData: [
      {
        name: "userType",
        textValue: "User Type",
        type: FilterDataType.SINGLE,
        options: [
          { label: "Business", value: "BUSINESS" },
          { label: "Freelancer", value: "FREELANCER" },
        ],
      },
      {
        name: "status",
        textValue: "Status",
        type: FilterDataType.SINGLE,
        options: [
          { label: "Pending", value: "PENDING" },
          { label: "Verified", value: "VERIFIED" },
          { label: "Reupload", value: "REUPLOAD" },
          { label: "Stopped", value: "STOPPED" },
          { label: "Applied", value: "APPLIED" },
        ],
      },
      // {
      //   name: "documentType",
      //   textValue: "Document Type",
      //   type: FilterDataType.SINGLE,
      //   options: [
      //     { label: "ID Proof", value: "ID_PROOF" },
      //     { label: "Address Proof", value: "ADDRESS_PROOF" },
      //     { label: "Business Registration", value: "BUSINESS_REGISTRATION" },
      //     { label: "Tax Document", value: "TAX_DOCUMENT" },
      //   ],
      // },
    ],
    searchColumn: ["userId", "documentType"],
    isDownload: true,
    // sortBy: [
    //   { fieldName: "submittedAt", label: "Submission Date" },
    //   { fieldName: "status", label: "Status" },
    // ],
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="KYC"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="KYC"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "KYC Requests", link: "#" },
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
