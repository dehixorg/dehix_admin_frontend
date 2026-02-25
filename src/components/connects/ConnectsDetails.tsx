// components/connects/ConnectsDetails.tsx

"use client";

import { useState, useEffect } from "react";
import { CustomComponentProps } from "../custom-table/FieldTypes";
import { CustomDialog } from "../CustomDialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Edit2, Check, X } from "lucide-react";
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
  const [editingAmount, setEditingAmount] = useState(false);
  const [amountValue, setAmountValue] = useState(data.amount);
  const [amountLoading, setAmountLoading] = useState(false);

  useEffect(() => {
    setNewStatus(data.status);
  }, [data.status]);

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
      refetch?.();
      await refreshNotifications();
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

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "User ID copied to clipboard",
    });
  };

  const handleUpdateAmount = async () => {
    setAmountLoading(true);
    try {
      const response = await apiHelperService.updateConnectAmount(
        id,
        Number(amountValue)
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Amount updated successfully",
        });
        refetch?.();
        setEditingAmount(false);
      } else {
        throw new Error(response.data?.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update amount",
        variant: "destructive",
      });
    } finally {
      setAmountLoading(false);
    }
  };

  const dialogContent = (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">
            User ID
          </p>
          <div className="flex flex-col gap-1 mt-1">
  <span
    onClick={() => handleCopy(data.userId)}
    title="Click to copy User ID"
    className="font-mono text-base text-blue-600 hover:underline cursor-pointer break-all"
  >
    {data.userId}
  </span>

  <Link
    href={`/users/view?id=${data.userId}`}
    className="text-xs text-gray-500 hover:underline"
  >
    View user profile →
  </Link>
</div>

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
          <div className="flex items-center gap-2 mt-1">
            {editingAmount ? (
              <>
                <Input
                  type="number"
                  value={amountValue.toString()}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Remove leading zeros but allow empty string or "0"
                    const numVal = val.replace(/^0+/, "");
                    setAmountValue(numVal === "" ? 0 : Number(numVal));
                  }}
                  className="w-24 h-8"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-green-600"
                  onClick={handleUpdateAmount}
                  disabled={amountLoading || amountValue === data.amount}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-600"
                  onClick={() => {
                    setAmountValue(data.amount);
                    setEditingAmount(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <p className="text-xl font-bold">₹{data.amount}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setEditingAmount(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">
            Current Status
          </p>
          <span
            className={`inline-block px-3 py-1 text-xs rounded-full font-semibold mt-1 ${data.status === "APPROVED"
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
            {(() => {
              const d = data.createdAt ? new Date(data.createdAt) : null;
              return d && !isNaN(d.getTime()) ? format(d, 'dd MMM yyyy, hh:mm a') : '-';
            })()}
          </p>
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">
            Updated At
          </p>
          <p className="text-sm mt-1">
             {(() => {
                const d = data.updatedAt ? new Date(data.updatedAt) : null;
                return d && !isNaN(d.getTime()) ? format(d, 'dd MMM yyyy, hh:mm a') : '-';
              })()}
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
