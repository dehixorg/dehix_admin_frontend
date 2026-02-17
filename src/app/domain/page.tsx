"use client";

import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
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
import AddDomain from "../../components/Domain/addDomain";
import { DomainDetail } from "@/components/Domain/DomainDetail";

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
    api: "/domain/admin",
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
        fieldName: "createdBy",
        textValue: "Created By",
        type: FieldType.STATUS,
        statusFormats: [
          {
            textValue: "Admin",
            value: "ADMIN",
            bgColor: "#3b82f6",
            textColor: "#ffffff",
          },
          {
            textValue: "Freelancer",
            value: "FREELANCER",
            bgColor: "#ec4899",
            textColor: "#ffffff",
          },
        ],
      },
      {
        fieldName: "createdById",
        textValue: "Created By ID",
        type: FieldType.TEXT,
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
        CustomComponent: DomainDetail,
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
      {
        name: "createdBy",
        textValue: "Created By",
        type: FilterDataType.SINGLE,
        options: [
          { label: "Admin", value: "ADMIN" },
          { label: "Freelancer", value: "FREELANCER" },
        ],
      },
    ],
    searchColumn: ["label"],
    tableHeaderActions: [AddDomain],
  };

  return (
    <AdminDashboardLayout
      active="Domain"
      breadcrumbItems={[
        { label: "Dashboard", link: "/dashboard/" },
        { label: "Domain", link: "#" },
      ]}
      showSearch={false}
      mainClassName="ml-5"
    >
      <CustomTable {...customTableProps} />
    </AdminDashboardLayout>
  );
}
