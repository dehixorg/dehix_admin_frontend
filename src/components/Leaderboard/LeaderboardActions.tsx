"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Info,
  Calculator,
  Gift,
  Edit,
  Archive,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/leaderboard";
import LeaderboardDetailsDialog from "./LeaderboardDetailsDialog";
import EditLeaderboardDialog from "./EditLeaderboardDialog";

interface LeaderboardActionsProps {
  data: any;
  id: string;
  refetch: () => void;
}

export default function LeaderboardActions({
  data,
  id,
  refetch,
}: LeaderboardActionsProps) {
  const { toast } = useToast();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    try {
      setLoading(true);
      await apiHelperService.calculateLeaderboard(id);
      toast({
        title: "Success",
        description: "Leaderboard scores calculated successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to calculate scores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDistribute = async () => {
    try {
      setLoading(true);
      await apiHelperService.distributeRewards(id);
      toast({
        title: "Success",
        description: "Rewards distributed successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to distribute rewards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    try {
      setLoading(true);
      await apiHelperService.archiveLeaderboard(id);
      toast({
        title: "Success",
        description: "Leaderboard archived successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to archive",
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
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setDetailsOpen(true);
            }}
          >
            <Info className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          {data.status !== "PUBLISHED" && data.status !== "ARCHIVED" && (
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}

          {(data.status === "SCHEDULED" || data.status === "ACTIVE") && (
            <DropdownMenuItem onClick={handleCalculate} disabled={loading}>
              <Calculator className="mr-2 h-4 w-4" />
              {data.status === "SCHEDULED"
                ? "Start Leaderboard"
                : "Calculate Scores"}
            </DropdownMenuItem>
          )}

          {data.status !== "ARCHIVED" && (
            <DropdownMenuItem onClick={handleArchive} disabled={loading}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <LeaderboardDetailsDialog
        leaderboardId={id}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        refetch={refetch}
      />

      <EditLeaderboardDialog
        leaderboardId={id}
        open={editOpen}
        onOpenChange={setEditOpen}
        refetch={refetch}
      />
    </>
  );
}
