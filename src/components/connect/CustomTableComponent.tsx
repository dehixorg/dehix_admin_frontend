import { useState } from "react";
import { CustomComponentProps } from "../custom-table/FieldTypes";
import { CustomDialog } from "../CustomDialog";
import { Button } from "../ui/button";
import ConfirmationDialog from "../confirmationDialog"
import { apiHelperService } from "@/services/connect";
import { useToast } from "../ui/use-toast";
import { Messages } from "@/utils/common/enum";

export const CustomTableComponent = ({ id, data, refetch }: CustomComponentProps) => {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const confirmStatusChange =async(
     
      id: string,
      status: string,
    ) =>{
      setSelectedStatus(status);
      setSelectedId(id);
      setIsDialogOpen(true);
    };

    const handleUpdateStatus = async (
        refetch: (() => void) | undefined
      ) => {
        if (!selectedStatus || !selectedId) 
          {toast({
          title: "Error",
          description: Messages.UPDATE_ERROR("connect"),
         
        }); 
        return ;}
        try {
          console.log(selectedId);
          console.log(selectedStatus);
          await apiHelperService.updateConnect(selectedId, selectedStatus);
          toast({
            title: "Success",
            description: Messages.UPDATE_SUCCESS("connect"),
          });
          refetch?.();
        } catch (error) {
          console.log(error);
          toast({
            title: "Error",
            description: Messages.UPDATE_ERROR("connect"),
          });
        }
      };

    return (
      data && (
        <>
          <CustomDialog
            title={"Status of Request"}
            description={""}
            content={
              <>
                <div>
                  <p>
                    <strong>Name:</strong> {data.status}
                  </p>
                  <div className="flex gap-4 mt-4">
        <Button variant="outline" onClick={() => confirmStatusChange(id, "APPROVED")}>
          Accept
        </Button>
        <Button variant="destructive" onClick={() => confirmStatusChange(id, "REJECTED")}>
          Reject
        </Button>
      </div>
                 
                </div>
              </>
            }
          />
         {isDialogOpen&&<ConfirmationDialog
          isOpen={isDialogOpen}
          title="Confirm Status Change"
          description="Are you sure you want to update the status?"
          confirmButtonName="Yes, Update"
          cancelButtonName="Cancel"
          onConfirm={() => {
            handleUpdateStatus(refetch); 
          }}
          onCancel={() => setIsDialogOpen(false)}
        />
        }
        </>
      )
    );
}