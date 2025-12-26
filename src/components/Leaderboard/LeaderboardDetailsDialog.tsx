"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { apiHelperService } from "@/services/leaderboard";
import { format, isValid, parseISO } from "date-fns";
import { Medal } from "lucide-react";

interface LeaderboardDetailsDialogProps {
  leaderboardId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

export default function LeaderboardDetailsDialog({
  leaderboardId,
  open,
  onOpenChange,
  refetch,
}: LeaderboardDetailsDialogProps) {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [gamificationData, setGamificationData] = useState<any[]>([]);

  useEffect(() => {
    if (open && leaderboardId) {
      fetchLeaderboardDetails();
      fetchGamificationData();
    }
  }, [open, leaderboardId]);

  const fetchLeaderboardDetails = async () => {
    try {
      setLoading(true);
      const response = await apiHelperService.getLeaderboardById(leaderboardId);
      if (response?.success) {
        setLeaderboard(response.data.data || response.data);
      } else {
        console.error("No success in response");
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGamificationData = async () => {
    try {
      const response = await apiHelperService.getGamificationDefinitions();
      if (response.success) {
        setGamificationData(response.data?.data || response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch gamification data:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-500";
      case "CALCULATING":
        return "bg-yellow-500";
      case "ARCHIVED":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "WEEKLY":
        return "bg-blue-500";
      case "BIWEEKLY":
        return "bg-purple-500";
      case "MONTHLY":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRankIcon = (rank: number) => {
    const colors = ["text-yellow-500", "text-gray-400", "text-amber-600"];
    return <Medal className={`h-5 w-5 ${colors[rank - 1]}`} />;
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!leaderboard) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{leaderboard.name}</DialogTitle>
          <DialogDescription>
            {leaderboard.description || "No description provided"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <Badge className={getStatusColor(leaderboard.status)}>
                      {leaderboard.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Frequency
                    </p>
                    <Badge className={getFrequencyColor(leaderboard.frequency)}>
                      {leaderboard.frequency}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Period Start
                    </p>
                    <p className="text-sm">
                      {(() => {
                        const startDate = parseISO(leaderboard.periodStart);
                        return isValid(startDate)
                          ? format(startDate, "PPP")
                          : "Invalid date";
                      })()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Period End
                    </p>
                    <p className="text-sm">
                      {(() => {
                        const endDate = parseISO(leaderboard.periodEnd);
                        return isValid(endDate)
                          ? format(endDate, "PPP")
                          : "Invalid date";
                      })()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Repeat Contest
                  </p>
                  <p className="text-sm">{leaderboard.repeat ? "Yes" : "No"}</p>
                </div>

                {leaderboard.rankings && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Rankings
                    </p>
                    <p className="text-sm">{leaderboard.rankings.length}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scoring Rules</CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.scoringRules?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Condition</TableHead>
                        <TableHead>Minimum</TableHead>
                        <TableHead>Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard.scoringRules.map(
                        (rule: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">
                              {rule.condition
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                                .split(" ")
                                .map(
                                  (word: string) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                            </TableCell>
                            <TableCell>{rule.min}</TableCell>
                            <TableCell>{rule.weight}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No custom scoring rules configured
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reward Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.rewardConfig?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-right">
                          Base Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard.rewardConfig.map((reward: any) => (
                        <TableRow key={reward.rank}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getRankIcon(reward.rank)}
                              <span className="font-medium">
                                #{reward.rank}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{reward.title}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${reward.baseAmount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No rewards configured for this contest
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eligibility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.eligibility !== undefined ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Allowed Badges
                      </p>
                      <p className="text-sm">
                        {leaderboard.eligibility.badgesAllowed?.length > 0
                          ? leaderboard.eligibility.badgesAllowed
                              .map((id: string) => {
                                const badge = gamificationData.find(
                                  (g) => g.type === "BADGE" && g._id === id
                                );
                                return badge?.name || id;
                              })
                              .filter(Boolean)
                              .join(", ")
                          : "Any badge allowed"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Allowed Levels
                      </p>
                      <p className="text-sm">
                        {leaderboard.eligibility.levelsAllowed?.length > 0
                          ? leaderboard.eligibility.levelsAllowed
                              .map((id: string) => {
                                const level = gamificationData.find(
                                  (g) => g.type === "LEVEL" && g._id === id
                                );
                                return level?.name || id;
                              })
                              .filter(Boolean)
                              .join(", ")
                          : "Any level allowed"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No specific eligibility criteria defined
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
