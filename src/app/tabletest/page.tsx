"use client";

import { CustomTable } from "@/components/custom-table/CustomTable";
import { FieldType } from "@/components/custom-table/FieldTypes";

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
          },
          {
            fieldName: "dob",
            textValue: "Date of birth",
            type: FieldType.DATETIME,
            sortable: false,
          },
          {
            fieldName: "delete",
            textValue: "Delete",
            type: FieldType.DELETE,
            deleteAction: (id: string) => {
              console.log("Delete hogya: ", id);
            },
          },
          {
            fieldName: "skills",
            textValue: "Skills",
            type: FieldType.ARRAY_VALUE,
            arrayName: "name",
          },
          {
            fieldName: "isFreelancer",
            textValue: "Freelancer",
            type: FieldType.TOGGLE,
            onToggle: (val, id) =>
              console.log("value changed to: ", val, "of", id),
          },
        ]}
      />
    </div>
  );
};

export default FreelancerTable;
