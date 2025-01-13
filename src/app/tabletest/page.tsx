"use client";

import { CustomTable } from "@/components/custom-table/CustomTable";
import { Currency, FieldType, FilterDataType } from "@/components/custom-table/FieldTypes";
import { GearIcon } from "@radix-ui/react-icons";
import { ArrowLeft, Pencil, PencilIcon, Settings, Trash2Icon } from "lucide-react";

const FreelancerTable: React.FC = () => {

  return (
    <div className="px-4">
      <div className="mb-8 mt-4 mr-4">
        <h2 className="table-title">Freelancer Table</h2>
      </div>
      <CustomTable
        uniqueId="_id"
        api="/freelancer"
        fields={[
          {
            fieldName: "firstName",
            textValue: "Name",
            type: FieldType.TEXT,
            sortable: false,
          },
          {
            fieldName: "email",
            textValue: "Email ID",
            type: FieldType.TEXT,
            sortable: false,
          },
          {
            fieldName: "phone",
            textValue: "Phone No.",
            type: FieldType.TEXT,
            sortable: false,
            tooltip: true,
            tooltipContent: "Personal Phone Number"
          },
          {
            fieldName: "dob",
            textValue: "Date of birth",
            type: FieldType.DATETIME,
            sortable: false,
          },
          {
            fieldName: "skills",
            textValue: "Skills",
            type: FieldType.ARRAY_VALUE,
            arrayName: "name",
          },
          // {
          //   // fieldName: "skills",
          //   textValue: "Salary",
          //   type: FieldType.CURRENCY,
          //   currency: Currency.USD
          //   // arrayName: "name",
          // },
          // {
          //   fieldName: "isFreelancer",
          //   textValue: "Freelancer",
          //   type: FieldType.TOGGLE,
          //   onToggle: (val, id) =>
          //     console.log("value changed to: ", val, "of", id),
          // },
          {
            // fieldName: "isFreelancer",
            textValue: "Actions",
            type: FieldType.ACTION,
            actions: {
              // icon: <ArrowLeft />,
              options: [
                {
                  actionName: "Edit",
                  actionIcon: <Pencil />,
                  type: "Link",
                  handler: () => console.log("kch kaam hua!")
                },
                {
                  actionName: "Settings",
                  actionIcon: <Settings />,
                  type: "Button",
                  handler: () => console.log("kch kaam hua!")
                },
                {
                  actionName: "Delete",
                  actionIcon: <Trash2Icon />,
                  type: "Link",
                  handler: () => console.log("kch kaam hua!"),
                  className: "bg-red-50 border-transparent border-[1px] hover:border-red-300 rounded text-red-400 transition"
                }
              ]
            }
          }
        ]}
        filterData={[
          {
            name: "skills",
            textValue: "Skills",
            type: FilterDataType.MULTI,
            options: [
              {label: "React", value: "React"},
              {label: "Vue", value: "Vue"},
              {label: "Django", value: "Django"},
              {label: "Angular", value: "Angular"},
              {label: "Node JS", value: "Nodejs"},
            ]
          },
          {
            name: "domain",
            textValue: "Domain",
            type: FilterDataType.SINGLE,
            options: [
              { label: "Frontend Developer", value: "Frontend" },
              { label: "Backend Developer", value: "Backend" },
              { label: "Full STack Developer", value: "Fullstack" },
            ]
          },
          {
            name: "role",
            textValue: "Role",
            type: FilterDataType.SINGLE,
            options: [
              { label: "Backend Developer", value: "Backend Developer" },
              { label: "Freelancer", value: "freelancer" },
            ]
          },
          // {
          //   name: "Salary",
          //   textValue: "Salary",
          //   type: FilterDataType.SINGLE,
          //   options: [
          //     { label: "Backend Developer", value: "Backend Developer" },
          //     { label: "Freelancer", value: "freelancer" },
          //   ]
          // }
        ]}
        tableHeaderActions={[
          {
            name: "Delete",
            icon: <Trash2Icon className="text-red-500" size={20} />,
            handler: () => { console.log("hogya") },
            className: "text-red-500 bg-red-100 hover:bg-red-200"
          },
          {
            name: "Edit",
            icon: <PencilIcon className="" size={20} />,
            handler: () => { console.log("hogya") },
          },
          {
            name: "Actions",
            icon: <GearIcon className="size-[20px]" />,
            handler: () => { console.log("hogya") },
          },
        ]}
        mainTableActions={[
          {
            name: "Settings",
            icon: <GearIcon className="size-[20px]" />,
            handler: () => { console.log("hogya") },
          },
        ]}
        searchColumn={['username', 'skills']}
      />
    </div>
  );
};

export default FreelancerTable;
