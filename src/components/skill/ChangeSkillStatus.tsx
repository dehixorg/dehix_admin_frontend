import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/skill";
import { Messages } from "@/utils/common/enum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChangeSkillStatusProps {
  skillId: string;
  currentStatus: string;
  onUpdateSuccess?: () => void;
}

const ChangeSkillStatus: React.FC<ChangeSkillStatusProps> = ({
  skillId,
  currentStatus,
  onUpdateSuccess,
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setIsLoading(true);
    try {
      await apiHelperService.updateSkillStatus(skillId, newStatus);
      toast({
        title: "Success",
        description: Messages.UPDATE_SUCCESS("skill status"),
        variant: "default",
      });
      onUpdateSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.UPDATE_ERROR("skill status"),
        variant: "destructive",
      });
      // Revert status on error
      setStatus(currentStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Status:</span>
      <Select
        value={status}
        onValueChange={handleStatusChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ChangeSkillStatus;
