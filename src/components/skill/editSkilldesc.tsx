import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/skill";
import { Messages } from "@/utils/common/enum";
import { CustomDialog } from "../CustomDialog";
interface EditSkillDescriptionProps {
  skillId: string;
  currentDescription: string;
  onUpdateSuccess?: () => void;
}

const EditSkillDescription: React.FC<EditSkillDescriptionProps> = ({
  skillId,
  currentDescription,
  onUpdateSuccess,
}) => {
  const [description, setDescription] = useState(currentDescription);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await apiHelperService.updateSkillDesc(skillId, description);
      toast({
        title: "Success",
        description: Messages.UPDATE_SUCCESS("skill description"),
        variant: "default",
      });
      setOpen(false);
      onUpdateSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.UPDATE_ERROR("skill description"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomDialog
      title={"Edit Domain Description"}
      description={""}
      triggerContent={
        <>
          <Button variant="outline"
          onClick={() => setOpen(true)}
          >Edit Description</Button>
        </>
      }
      triggerState={open}
      setTriggerState={setOpen}
      content={
        <>
          <div className="space-y-4">
            <div className="block text-sm font-medium ">Description</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter new description"
              className="block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 resize-none overflow-hidden break-words"
              rows={4}
            />
          </div>
        </>
      }
      footer={
        <>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={isLoading || description.trim() === ""}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </>
      }
    />
  );
};

export default EditSkillDescription;
