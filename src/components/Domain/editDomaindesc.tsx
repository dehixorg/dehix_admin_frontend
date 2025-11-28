import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/domain";
import { Messages } from "@/utils/common/enum";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditDomainDescriptionProps {
  domainId: string;
  currentDescription: string;
  onUpdateSuccess: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const EditDomainDescription: React.FC<EditDomainDescriptionProps> = ({
  domainId,
  currentDescription,
  onUpdateSuccess,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const [description, setDescription] = useState(currentDescription);
  const [isOpen, setIsOpen] = useState(isDialogOpen || false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Update local state when prop changes
  useEffect(() => {
    setIsOpen(isDialogOpen);
  }, [isDialogOpen]);

  const handleSave = async () => {
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Description cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiHelperService.updateDomainDesc(domainId, description);
      toast({
        title: "Success",
        description: Messages.UPDATE_SUCCESS("domain description"),
      });
      onUpdateSuccess();
      setIsOpen(false);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.UPDATE_ERROR("domain description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setIsDialogOpen(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Domain Description</DialogTitle>
          <DialogDescription>
            Update the description for this domain.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter domain description"
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setIsDialogOpen(false);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !description.trim()}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDomainDescription;
