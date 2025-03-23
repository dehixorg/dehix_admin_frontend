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
import { VerifyAction } from "@/components/verification/VerifyAction";


const BusinessTabs = () => {
  const customTableProps: TableProps = {
    api: "/verification/oracle",
    fields: [
      {
        textValue: "Verifier ID",
        type: FieldType.LONGTEXT,
        fieldName: "verifier_id",
        wordsCnt: 10,
      },
      {
        textValue: "Verifier Username",
        type: FieldType.TEXT,
        fieldName: "verifier_username",
      },
      {
        textValue: "Requester ID",
        type: FieldType.LONGTEXT,
        fieldName: "requester_id",
        wordsCnt: 10,
      },
      {
        textValue: "Requester Username",
        type: FieldType.TEXT,
        fieldName: "requester_username"
      },
      {
        textValue: "Document ID",
        type: FieldType.LONGTEXT,
        fieldName: "document_id",
        wordsCnt: 10,
      },
      {
        textValue: "Document Type",
        type: FieldType.STATUS,
        fieldName: "doc_type",
        statusFormats: [
          {
            textValue: "Project",
            value: "project",
            isUppercase: true,
            bgColor: "#4169E1",
            textColor: "white",
          },
          {
            textValue: "Experience",
            value: "experience",
            isUppercase: true,
            bgColor: "#50C878",
            textColor: "white",
          },
          {
            textValue: "Skill",
            value: "skill",
            isUppercase: true,
            bgColor: "#FF4500",
            textColor: "white",
          },
          {
            textValue: "Domain",
            value: "domain",
            isUppercase: true,
            bgColor: "#9966CC",
            textColor: "white",
          },
          {
            textValue: "Education",
            value: "education",
            isUppercase: true,
            bgColor: "#008080",
            textColor: "white",
          },
          {
            textValue: "Business",
            value: "business",
            isUppercase: true,
            bgColor: "#FFD700",
            textColor: "#333333",
          },
        ],
      },
      {
        textValue: "Verified At",
        type: FieldType.DATE,
        fieldName: "verified_at",
      },
      {
        textValue: "Status",
        type: FieldType.STATUS,
        fieldName: "verification_status",
        statusFormats: [
          {
            textValue: "Pending",
            value: "PENDING",
            bgColor: "yellow",
            isUppercase: true,
            textColor: "black",
          },
          {
            textValue: "Approved",
            value: "APPROVED",
            bgColor: "#50C878",
            isUppercase: true,
            textColor: "white",
          },
          {
            textValue: "Denied",
            value: "DENIED",
            bgColor: "#ff004f",
            isUppercase: true,
            textColor: "white",
          }
        ],
      },
      {
        textValue: "Comments",
        type: FieldType.LONGTEXT,
        fieldName: "comment",
        wordsCnt: 10
      },
      {
        type: FieldType.CUSTOM,
        textValue: "",
        CustomComponent: VerifyAction
      },
    ],
    uniqueId: "_id",
    title: "Verifications",
    searchColumn: ["verifier_username"],
    filterData: [
      {
        name: "doc_type",
        textValue: "Document Type",
        type: FilterDataType.SINGLE,
        options: [
          { label: "Experience", value: "experience" },
          { label: "Skill", value: "skill" },
          { label: "Project", value: "project" },
          { label: "Domain", value: "domain" },
          { label: "Education", value: "education" },
          { label: "Business", value: "business" },
        ],
      },
      {
        name: "verification_status",
        textValue: "Verification Status",
        type: FilterDataType.SINGLE,
        options: [
          { label: "Pending", value: "PENDING" },
          { label: "Approved", value: "APPROVED" },
          { label: "Denied", value: "DENIED" },
        ]
      }
    ],
  };

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
              { label: "Dashboard", link: "" },
              { label: "Verification", link: "/verification" },
            ]}
          />

          <div className="relative ml-auto flex-1 md:grow-0">
            <DropdownProfile />
          </div>
        </header>
        <main className="ml-5 mr-5">
          <CustomTable {...customTableProps} />
        </main>
      </div>
    </div>
  );
};
export default BusinessTabs;
