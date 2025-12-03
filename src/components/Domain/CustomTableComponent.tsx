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

    const handleUpdateDescription = async (
        newDescription: string,
        id: string,
        refetch: (() => void) | undefined
      ) => {
        try {
          await apiHelperService.updateDomainDesc(id, newDescription);
          toast({
            title: "Success",
            description: Messages.UPDATE_SUCCESS("domain"),
          });
          refetch?.();
        } catch (error) {
          toast({
            title: "Error",
            description: Messages.UPDATE_ERROR("domain"),
          });
        }
      };

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
              isDialogopen={isEditDialogOpen}
              setIsDialogOpen={() => setIsEditDialogOpen(false)}
              domainId={data._id}
              currentDescription={data.description || ""}
              currentStatus={data.status || "active"} // Default to "active" if status is not available
              onDescriptionUpdate={(newDescription) =>
                handleUpdateDescription(
                  newDescription,
                  id,
                  refetch
                )
              }
            />
          )}
        </>
      )
    );
}