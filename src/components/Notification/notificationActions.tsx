import { Pause, Trash2, Play } from "lucide-react";
import { apiHelperService } from "@/services/notification";
import { NotificationStatusEnum } from "@/utils/common/enum";
import { Actions, CustomTableChildComponentsProps } from "../custom-table/FieldTypes";

export const notificationActions: Actions = {
  options: [
    {
      actionName: "Inactive",
      actionIcon: <Pause className="text-yellow-600" />,
      type: "Button",
      handler: async ({ id, refetch }: { id: string; refetch?: () => void }) => {
        await apiHelperService.updateNotificationStatus(id, NotificationStatusEnum.IN_ACTIVE);
        refetch && refetch();
      },
      className: "text-yellow-600",
    },
    {
      actionName: "Active",
      actionIcon: <Play className="text-green-600" />,
      type: "Button",
      handler: async ({ id, refetch }: { id: string; refetch?: () => void }) => {
        await apiHelperService.updateNotificationStatus(id, NotificationStatusEnum.ACTIVE);
        refetch && refetch();
      },
      className: "text-green-600",
    },
    {
      actionName: "Delete",
      actionIcon: <Trash2 className="text-red-600" />,
      type: "Button",
      handler: async ({ id, refetch }: { id: string; refetch?: () => void }) => {
        await apiHelperService.deleteNotification(id);
        refetch && refetch();
      },
      className: "text-red-600",
    },
  ],
};
