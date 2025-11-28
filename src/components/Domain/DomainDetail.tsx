import { useState } from "react";
import { CustomDialog } from "../CustomDialog";
import { CustomComponentProps } from "../custom-table/FieldTypes";
import EditDomainDescription from "./editDomaindesc";
import ChangeDomainStatus from "./ChangeDomainStatus";
import { Button } from "@/components/ui/button";

export const DomainDetail = ({ id, data, refetch }: CustomComponentProps) => {
  const [open, setOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  return (
    <CustomDialog
      title={"Domain Details"}
      triggerState={open}
      setTriggerState={setOpen}
      description={""}
      content={
        <>
          <div>
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {data.label}
              </p>
              <p>
                <strong>Description:</strong>
                {data.description
                  ? data.description
                  : "No description available"}
              </p>
              <ChangeDomainStatus
                domainId={id}
                currentStatus={data.status || "active"}
                onUpdateSuccess={() => {
                  refetch?.();
                }}
              />
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(true);
                }}
                className="w-full"
              >
                Edit Description
              </Button>
              <EditDomainDescription
                domainId={id}
                currentDescription={data.description || ""}
                isDialogOpen={isEditDialogOpen}
                setIsDialogOpen={setIsEditDialogOpen}
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

export default DomainDetail;
