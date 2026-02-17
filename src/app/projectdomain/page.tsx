"use client";
import { Trash2Icon } from "lucide-react";

import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { CustomTable } from "@/components/custom-table/CustomTable";
import {
  FieldType,
  FilterDataType,
  Params as TableProps,
} from "@/components/custom-table/FieldTypes";
import AddProjectDomain from "@/components/ProjectDomain/addProjectDomain";
import { apiHelperService } from "@/services/projectdomain";
import { useToast } from "@/components/ui/use-toast";
import { Messages } from "@/utils/common/enum";
import { ProjectDomainDetail } from "@/components/ProjectDomain/ProjectDomainDetail";

export default function Talent() {
  const { toast } = useToast();

  const handleDelete = async (domainId: string) => {
    try {
      await apiHelperService.deleteProjectdomain(domainId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: Messages.DELETE_ERROR("domain"),
        variant: "destructive", // Red error message
      });
    }
  };

  const customTableProps: TableProps = {
    api: "/projectdomain/admin",
    uniqueId: "_id",
    fields: [
      {
        textValue: "Domain",
        type: FieldType.TEXT,
        fieldName: "label",
      },
      {
        textValue: "Description",
        fieldName: "description",
        type: FieldType.LONGTEXT,
        wordsCnt: 60,
      },
      {
        textValue: "Status",
        type: FieldType.STATUS,
        fieldName: "status",
        statusFormats: [
          {
            textValue: "Active",
            value: "ACTIVE",
            bgColor: "#57fa70",
            textColor: "#024d0d",
          },
          {
            textValue: "In Active",
            value: "INACTIVE",
            bgColor: "yellow",
            textColor: "#525002",
          },
        ],
      },
      {
        textValue: "Created By",
        type: FieldType.STATUS,
        fieldName: "createdBy",
        statusFormats: [
          {
            textValue: "Admin",
            value: "ADMIN",
            bgColor: "#5bbcfc",
            textColor: "#031f5c",
          },
          {
            textValue: "Freelancer",
            value: "FREELANCER",
            bgColor: "#fc88c0",
            textColor: "#5c0328",
          },
        ],
      },
      {
        textValue: "Creator Id",
        type: FieldType.TEXT,
        fieldName: "createdById",
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
              handler: async ({ id, refetch }) => {
                try {
                  await apiHelperService.deleteProjectdomain(id);
                  refetch?.();
                } catch (error: any) {
                  toast({
                    title: "Error",
                    description: Messages.DELETE_ERROR("domain"),
                    variant: "destructive", // Red error message
                  });
                }
              },
            },
          ],
        },
      },
      {
        textValue: "",
        type: FieldType.CUSTOM,
        CustomComponent: ProjectDomainDetail,
      },
    ],
    filterData: [
      {
        name: "status",
        textValue: "Status",
        type: FilterDataType.SINGLE,
        options: [
          { label: "Active", value: "active,Active,ACTIVE" },
          { label: "Inactive", value: "inactive,INACTIVE,Inactive" },
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
    tableHeaderActions: [AddProjectDomain],
    searchColumn: [
      "label",
      "description",
      "status",
      "createdBy",
      "createdById",
    ],
  };

  return (
    <AdminDashboardLayout
      active="Project Domain"
      breadcrumbItems={[
        { label: "Dashboard", link: "/dashboard/" },
        { label: "Project Domain", link: "#" },
      ]}
      mainClassName="ml-5"
    >
      <CustomTable {...customTableProps} />
    </AdminDashboardLayout>
  );
}
