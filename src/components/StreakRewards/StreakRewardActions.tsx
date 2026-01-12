"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { streakRewardService } from "@/services/streakRewardService";
import EditStreakRewardDialog from "./EditStreakRewardDialog";
import {
  MoreVertical,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface StreakRewardActionsProps {
  data: any;
  id: string;
  refetch?: () => void;
}

export default function StreakRewardActions({
  data,
  id,
  refetch,
}: StreakRewardActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggleActive = async () => {
    setLoading(true);
    try {
      await streakRewardService.toggleActiveStatus(id, !data.isActive);
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
      if (refetch) refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this streak reward? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      await streakRewardService.deleteStreakReward(id);
      toast({
        title: "Success",
        description: "Streak reward deleted successfully",
      });
      if (refetch) refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to delete streak reward",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={loading}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleActive}>
            {data.isActive ? (
              <>
                <ToggleLeft className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <ToggleRight className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditStreakRewardDialog
        streakRewardId={id}
        open={editOpen}
        onOpenChange={setEditOpen}
        refetch={refetch || (() => {})}
      />
    </>
  );
}
