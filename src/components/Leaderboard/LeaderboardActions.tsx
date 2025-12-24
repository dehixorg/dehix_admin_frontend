"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Info, Calculator, Gift } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/leaderboard";
import LeaderboardDetailsDialog from "./LeaderboardDetailsDialog";

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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
            <Info className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          {data.status !== "PUBLISHED" && (
            <DropdownMenuItem onClick={handleCalculate} disabled={loading}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Scores
            </DropdownMenuItem>
          )}
          {data.status === "CALCULATING" && (
            <DropdownMenuItem onClick={handleDistribute} disabled={loading}>
              <Gift className="mr-2 h-4 w-4" />
              Distribute Rewards
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
    </>
  );
}
