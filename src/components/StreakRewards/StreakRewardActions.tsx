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
import DeleteStreakRewardDialog from "./DeleteStreakRewardDialog";
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
  const [deleteOpen, setDeleteOpen] = useState(false);
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
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-red-600"
          >
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

      <DeleteStreakRewardDialog
        data={data}
        refetch={refetch}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
