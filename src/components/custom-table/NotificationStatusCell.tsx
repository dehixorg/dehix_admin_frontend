import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FieldComponentProps } from "./FieldTypes";
import { Trash2, Pause, Play } from "lucide-react";
import { apiHelperService } from "@/services/notification";
import { useToast } from "../ui/use-toast";

const NotificationStatusCell = ({
  value,
  id,
  refetch,
}: FieldComponentProps<string>) => {
  const { toast } = useToast();
  const isActive = value === "ACTIVE";
  const isInactive = value === "IN_ACTIVE";

  const handleSetActive = async () => {
    await apiHelperService.updateNotificationStatus(id, "ACTIVE");
    toast({
      title: "Status Updated",
      description: "Notification set to Active.",
    });
    refetch && refetch();
  };
  const handleSetInactive = async () => {
    await apiHelperService.updateNotificationStatus(id, "IN_ACTIVE");
    toast({
      title: "Status Updated",
      description: "Notification set to Inactive.",
    });
    refetch && refetch();
  };
  const handleDelete = async () => {
    await apiHelperService.deleteNotification(id);
    toast({ title: "Deleted", description: "Notification deleted." });
    refetch && refetch();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          className={`rounded-sm px-2 py-1 text-center cursor-pointer ${isActive ? "bg-[#57fa70] text-[#024d0d]" : isInactive ? "bg-red-600 text-white" : "bg-gray-400 text-gray-900"}`}
        >
          {isActive ? "Active" : isInactive ? "Inactive" : value}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isActive ? (
          <DropdownMenuItem
            onClick={handleSetInactive}
            className="text-yellow-600"
          >
            <Pause className="mr-2 h-4 w-4" /> Set Inactive
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={handleSetActive}
            className="text-green-600"
          >
            <Play className="mr-2 h-4 w-4" /> Set Active
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Replace the default StatusField export with NotificationStatusCell
export { NotificationStatusCell };
