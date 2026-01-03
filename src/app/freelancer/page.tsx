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
import { ChevronRight, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Talent() {
  const router = useRouter();

  const customTableProps: TableProps = {
    title: "Freelancers",
    uniqueId: "_id",
    api: "/freelancer",
    fields: [
      {
        fieldName: "firstName",
        textValue: "Name",
        type: FieldType.TEXT,
      },
      {
        fieldName: "email",
        textValue: "Email ID",
        type: FieldType.TEXT,
      },
      {
        fieldName: "phone",
        textValue: "Phone No.",
        type: FieldType.TEXT,
        tooltip: true,
        tooltipContent: "Personal Phone Number",
      },
      {
        fieldName: "attributes",
        textValue: "Skills",
        type: FieldType.CUSTOM,
        component: (props: { value?: Array<{ type: string; name: string }> }) => {
          // Safely access and filter skills
          const skills = Array.isArray(props.value) 
            ? props.value
                .filter(attr => attr?.type === "SKILL")
                .map(skill => skill.name)
                .filter(Boolean) // Remove any undefined/null values
            : [];
          
          return (
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 3).map((skill, index) => (
                <span key={`skill-${index}`} className="px-2 py-1 text-xs bg-gray-100 rounded-md">
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="text-xs text-gray-500">+{skills.length - 3} more</span>
              )}
              {skills.length === 0 && <span className="text-xs text-gray-400">No skills</span>}
            </div>
          );
        },
      },
      {
        fieldName: "attributes",
        textValue: "Domains",
        type: FieldType.CUSTOM,
        component: (props: { value?: Array<{ type: string; name: string }> }) => {
          // Safely access and filter domains
          const domains = Array.isArray(props.value)
            ? props.value
                .filter(attr => attr?.type === "DOMAIN")
                .map(domain => domain.name)
                .filter(Boolean) // Remove any undefined/null values
            : [];
          
          return (
            <div className="flex flex-wrap gap-1">
              {domains.slice(0, 3).map((domain, index) => (
                <span key={`domain-${index}`} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md">
                  {domain}
                </span>
              ))}
              {domains.length > 3 && (
                <span className="text-xs text-gray-500">+{domains.length - 3} more</span>
              )}
              {domains.length === 0 && <span className="text-xs text-gray-400">No domains</span>}
            </div>
          );
        },
      },
      {
        textValue: "",
        type: FieldType.ACTION,
        actions: {
          icon: <ChevronRight className="w-4 h-4" />,
          options: [
            {
              actionName: "View",
              actionIcon: <Info className="text-gray-500 w-4 h-4" />,
              type: "Button",
              handler: (id) => {
                router.push(`/freelancer/tabs?id=${id.id}`);
              },
            },
          ],
        },
      },
    ],
    filterData: [
      {
        name: "status",
        textValue: "Status",
        type: FilterDataType.SINGLE,
        options: [
          { label: "ACTIVE", value: "ACTIVE" },
          { label: "NOT VERIFIED", value: "Not_Verified,Notverified,NOT_VERIFIED" },
        ],
      },
      {
        name: "skills",
        textValue: "Skills",
        type: FilterDataType.MULTI,
        arrayName: "name",
        options: [
          { label: "React", value: "React" },
          { label: "Vue", value: "Vue" },
          { label: "Django", value: "Django" },
          { label: "Angular", value: "Angular" },
          { label: "Node JS", value: "Node.js" }
        ],
      },
      {
        name: "domain",
        textValue: "Domain",
        arrayName: "name",
        type: FilterDataType.SINGLE,
        options: [
          { label: "Frontend Developer", value: "Frontend" },
          { label: "Backend Developer", value: "Backend" },
          { label: "Full Stack Developer", value: "Fullstack" },
        ],
      },
    ],
    searchColumn: ["firstName", "email"],
    isDownload: true,
    sortBy: [{ fieldName: "createdAt", label: "Created At" }]
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Freelancer"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Freelancer"
          />
          <Breadcrumb
            items={[
              { label: "Freelancer", link: "#" },
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <DropdownProfile />
          </div>
        </header>
        <main className="ml-5">
          <CustomTable
            {...customTableProps}
          />
        </main>
      </div>
    </div>
  );
}
