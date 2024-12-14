import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/projectdomain";
import { Messages } from "@/utils/common/enum";
interface EditDomainDescriptionProps {
  domainId: string;
  currentDescription: string;
  isDialogopen: boolean;
  onDescriptionUpdate: (newDescription: string) => void;
  setIsDialogOpen:(open:boolean)=>void;
  
}

const EditDomainDescription: React.FC<EditDomainDescriptionProps> = ({
  isDialogopen,
  domainId,
  currentDescription,
  onDescriptionUpdate,
  setIsDialogOpen,
}) => {
  const [description, setDescription] = useState(currentDescription);
  //const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await apiHelperService.updateProjectdomainDesc(domainId, description);
      onDescriptionUpdate(description);
      toast({
        title: "Success",
        description: Messages.UPDATE_SUCCESS('domain description'),
        variant: "default",
      });
      setIsDialogOpen(false); // Close dialog on success
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.UPDATE_ERROR('domain description'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDescription(currentDescription); // Reset description to original value
    setIsDialogOpen(false); // Close dialog
  };

  return (
    <Dialog open={isDialogopen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
      <Button
  variant="outline"
  onClick={() => {
    setIsDialogOpen(true);
  }}
>
          Edit Description
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="break-words text-lg font-semibold">
            Edit Domain Description
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="block text-sm font-medium ">
            Description
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter new description"
            className="block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 resize-none overflow-hidden break-words"
            rows={4}
          />
        </div>
        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={handleCancel} 
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={isLoading || description.trim() === ""}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDomainDescription;
