"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { streakRewardService } from "@/services/streakRewardService";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Messages } from "@/utils/common/enum";
import { CustomTableChildComponentsProps } from "../custom-table/FieldTypes";

interface DeleteStreakRewardProps extends CustomTableChildComponentsProps {
  data: any;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DeleteStreakRewardDialog: React.FC<DeleteStreakRewardProps> = ({
  data,
  refetch,
  onClose,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!data?._id) {
      toast({
        title: "Error",
        description: "Invalid streak reward ID",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      await streakRewardService.deleteStreakReward(data._id);
      toast({
        title: "Success",
        description: Messages.DELETE_SUCCESS("streak reward"),
      });
      refetch?.();
      onClose?.();
      setOpen(false);
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          Messages.DELETE_ERROR("streak reward"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm" className="ml-2">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Streak Reward</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this streak reward? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            <strong>Days:</strong> {data?.days}
            <br />
            <strong>Reward:</strong> {data?.reward} connects
            <br />
            <strong>Title:</strong> {data?.title}
            <br />
            <strong>Description:</strong>{" "}
            {data?.description || "No description"}
            <br />
            <strong>Status:</strong> {data?.isActive ? "Active" : "Inactive"}
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStreakRewardDialog;
