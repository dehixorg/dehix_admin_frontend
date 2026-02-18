// components/connects/ConnectsDetails.tsx

"use client";

import { useState } from "react";
import { CustomComponentProps } from "../custom-table/FieldTypes";
import { CustomDialog } from "../CustomDialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";
import { Messages } from "@/utils/common/enum";
import { apiHelperService } from "@/services/connects"; // Make sure this is imported
import { useAdminSidebarNotifications } from "@/hooks/useAdminSidebarNotifications";
import Link from "next/link";
import { format } from "date-fns";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export const ConnectsDetails = ({
  id,
  data,
  refetch,
}: CustomComponentProps) => {
  const { toast } = useToast();
  const { refreshNotifications } = useAdminSidebarNotifications();
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(data.status);
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    setLoading(true);
    try {
      // Corrected API call using the new service method
      await apiHelperService.updateConnectStatus(id, newStatus);

      toast({
        title: "Success",
        description: Messages.UPDATE_SUCCESS("connect status"),
      });

      // Refresh table data and notification counts immediately
      console.log("🔄 About to call refreshNotifications");
      refetch?.();
      await refreshNotifications();
      console.log("🔄 refreshNotifications call completed");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: Messages.UPDATE_ERROR("connect status"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const dialogContent = (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">
            User ID
          </p>
          <Link
            href={`/users/view?id=${data.userId}`}
            className="font-mono text-base mt-1 text-blue-600 hover:underline dark:text-blue-400 break-all"
          >
            {data.userId}
          </Link>
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">
            User Type
          </p>
          <p className="font-mono text-base mt-1 break-all">{data.userType}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">
            Amount
          </p>
          <p className="text-xl font-bold mt-1">₹{data.amount}</p>
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">
            Current Status
          </p>
          <span
            className={`inline-block px-3 py-1 text-xs rounded-full font-semibold mt-1 ${
              data.status === "APPROVED"
                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-50"
                : data.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-50"
                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-50"
            }`}
          >
            {data.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">
            Change Status
          </p>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button
            onClick={handleUpdateStatus}
            disabled={loading || newStatus === data.status}
            className="w-full"
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">
            Created At
          </p>
          <p className="text-sm mt-1">
            {data.createdAt
              ? format(new Date(data.createdAt), "MMM d, yyyy HH:mm")
              : "-"}
          </p>
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">
            Updated At
          </p>
          <p className="text-sm mt-1">
            {data.updatedAt
              ? format(new Date(data.updatedAt), "MMM d, yyyy HH:mm")
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    data && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="cursor-pointer text-gray-500 hover:text-gray-700"></div>
        </DialogTrigger>
        <CustomDialog
          title="Connects Details"
          description="Detailed information and status management for the selected token request."
          content={dialogContent}
        />
      </Dialog>
    )
  );
};
