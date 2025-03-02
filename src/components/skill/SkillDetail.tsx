import { useState } from "react";
import { CustomDialog } from "../CustomDialog";
import { CustomComponentProps } from "../custom-table/FieldTypes";
import EditSkillDescription from "./editSkilldesc";

export const SkillDetails = ({ id, data, refetch }: CustomComponentProps) => {
  const [open, setOpen] = useState(false);
  return (
    <CustomDialog
      title={"Skill Details"}
      triggerState={open}
      setTriggerState={setOpen}
      description={""}
      content={
        <>
          <div>
            <div>
              <p>
                <strong>Name:</strong> {data.label}
              </p>
              <p>
                <strong>Description:</strong>
                {data.description
                  ? data.description
                  : "No description available"}
              </p>
              <EditSkillDescription
                skillId={id}
                currentDescription={data.description || ""}
                onUpdateSuccess={() => {
                  setOpen(false);
                  refetch?.();
                }}
              />
            </div>
          </div>
        </>
      }
    />
  );
};
