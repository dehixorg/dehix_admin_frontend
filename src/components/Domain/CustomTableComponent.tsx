import { useState } from "react";
import { CustomComponentProps } from "../custom-table/FieldTypes";
import { CustomDialog } from "../CustomDialog";
import { Button } from "../ui/button";
import EditDomainDescription from "./editDomaindesc";
import { apiHelperService } from "@/services/domain";
import { useToast } from "../ui/use-toast";
import { Messages } from "@/utils/common/enum";

export const CustomTableComponent = ({ id, data, refetch }: CustomComponentProps) => {
    const { toast } = useToast();

    const [isEditDialogOpen, setIsEditDialogOpen] =
      useState(false);
    return (
      data && (
        <>
          <CustomDialog
            title={"Domain Details"}
            description={""}
            content={
              <>
                <div>
                  <p>
                    <strong>Name:</strong> {data.label}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {data.description ||
                      "No description available"}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(true);
                    }}
                  >
                    Edit Description
                  </Button>
                </div>
              </>
            }
          />
          {isEditDialogOpen && (
            <EditDomainDescription
              isDialogOpen={isEditDialogOpen}
              setIsDialogOpen={() => setIsEditDialogOpen(false)}
              domainId={data._id}
              currentDescription={data.description || ""}
              onUpdateSuccess={() => refetch?.()}
            />
          )}
        </>
      )
    );
}