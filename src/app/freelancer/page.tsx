"use client";

import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
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
        textValue: "Skills",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data }: { data: Record<string, any> }) => {
          // Safely access and filter skills
          const skills = Array.isArray(data.attributes)
            ? data.attributes
                .filter((attr) => attr?.type === "SKILL" && attr?.name)
                .map((skill) => skill.name?.trim())
                .filter((name) => name && name.length > 0)
            : [];

          return (
            <div className="flex flex-wrap gap-1">
              {skills.length > 0 ? (
                <>
                  {skills.slice(0, 1).map((skill, index) => (
                    <span
                      key={`skill-${index}`}
                      className="text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {skills.length > 1 && (
                    <span className="text-xs text-gray-500">
                      +{skills.length - 1} more
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs text-gray-400">No skills</span>
              )}
            </div>
          );
        },
      },
      {
        textValue: "Domains",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data }: { data: Record<string, any> }) => {
          // Safely access and filter domains
          const domains = Array.isArray(data.attributes)
            ? data.attributes
                .filter((attr) => attr?.type === "DOMAIN" && attr?.name)
                .map((domain) => domain.name?.trim())
                .filter((name) => name && name.length > 0) // Remove any undefined/null/empty values
            : [];

          return (
            <div className="flex flex-wrap gap-1">
              {domains.length > 0 ? (
                <>
                  {domains.slice(0, 1).map((domain, index) => (
                    <span
                      key={`domain-${index}`}
                      className="text-sm"
                    >
                      {domain}
                    </span>
                  ))}
                  {domains.length > 1 && (
                    <span className="text-xs text-gray-500">
                      +{domains.length - 1} more
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs text-gray-400">No domains</span>
              )}
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
          {
            label: "NOT VERIFIED",
            value: "Not_Verified,Notverified,NOT_VERIFIED",
          },
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
          { label: "Node JS", value: "Node.js" },
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
    sortBy: [{ fieldName: "createdAt", label: "Created At" }],
  };

  return (
    <AdminDashboardLayout
      active="Freelancer"
      breadcrumbItems={[{ label: "Freelancer", link: "#" }]}
      showSearch={false}
      mainClassName="ml-5"
    >
      <CustomTable {...customTableProps} />
    </AdminDashboardLayout>
  );
}
