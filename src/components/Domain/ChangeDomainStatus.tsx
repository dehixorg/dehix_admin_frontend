import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/domain";
import { Messages } from "@/utils/common/enum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChangeDomainStatusProps {
  domainId: string;
  currentStatus: string;
  onUpdateSuccess?: () => void;
}

const ChangeDomainStatus: React.FC<ChangeDomainStatusProps> = ({
  domainId,
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
      await apiHelperService.updateDomainStatus(domainId, newStatus);
      toast({
        title: "Success",
        description: Messages.UPDATE_SUCCESS("domain status"),
        variant: "default",
      });
      onUpdateSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.UPDATE_ERROR("domain status"),
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

export default ChangeDomainStatus;
