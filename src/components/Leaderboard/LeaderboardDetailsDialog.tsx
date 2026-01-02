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
import { Medal, Trophy, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      case "SCHEDULED":
        return "bg-blue-500";
      case "ACTIVE":
        return "bg-yellow-500";
      case "PUBLISHED":
        return "bg-green-500";
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

  const getRankMedalIcon = (rank: number) => {
    const colors = ["text-yellow-500", "text-gray-400", "text-amber-600"];
    return <Medal className={`h-5 w-5 ${colors[rank - 1]}`} />;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-12 w-12 text-yellow-500" />;
      case 2:
        return <Medal className="h-12 w-12 text-gray-400" />;
      case 3:
        return <Award className="h-12 w-12 text-amber-700" />;
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "border-yellow-500 bg-yellow-50";
      case 2:
        return "border-gray-400 bg-gray-50";
      case 3:
        return "border-amber-700 bg-amber-50";
      default:
        return "border-gray-200";
    }
  };

  const formatDate = (date: string) => {
    const parsedDate = parseISO(date);
    return isValid(parsedDate)
      ? format(parsedDate, "PPP")
      : "Invalid Date";
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

  const topThree = leaderboard.rankings?.slice(0, 3) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{leaderboard.name}</DialogTitle>
          <DialogDescription>
            {leaderboard.description || "No description provided"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className={`grid w-full ${leaderboard.status === 'PUBLISHED' ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            {leaderboard.status === 'PUBLISHED' && <TabsTrigger value="rankings">Rankings</TabsTrigger>}
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
                      {formatDate(leaderboard.periodStart)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Period End
                    </p>
                    <p className="text-sm">
                      {formatDate(leaderboard.periodEnd)}
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
                {leaderboard.scoringWeights ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Condition</TableHead>
                          <TableHead>Minimum</TableHead>
                          <TableHead>Weight</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(leaderboard.scoringWeights)
                          .filter(([key]) => !key.includes("Bonus"))
                          .map(([key, value]: [string, any]) => (
                            <TableRow key={key}>
                              <TableCell className="font-medium">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()
                                  .split(" ")
                                  .map(
                                    (word: string) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                  )
                                  .join(" ")}
                              </TableCell>
                              <TableCell>{value.min}</TableCell>
                              <TableCell>{value.weight}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    {(leaderboard.scoringWeights.verifiedProfileBonus > 0 ||
                      leaderboard.scoringWeights.oracleBonus > 0) && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-semibold">Bonus Scores</h4>
                        {leaderboard.scoringWeights.verifiedProfileBonus >
                          0 && (
                          <p className="text-sm">
                            <span className="font-medium">
                              Verified Profile Bonus:
                            </span>{" "}
                            {leaderboard.scoringWeights.verifiedProfileBonus}
                          </p>
                        )}
                        {leaderboard.scoringWeights.oracleBonus > 0 && (
                          <p className="text-sm">
                            <span className="font-medium">Oracle Bonus:</span>{" "}
                            {leaderboard.scoringWeights.oracleBonus}
                          </p>
                        )}
                      </div>
                    )}
                  </>
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
                              {getRankMedalIcon(reward.rank)}
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
          
          {leaderboard.status === 'PUBLISHED' && (
            <TabsContent value="rankings">
               <div className="space-y-6">
                  {/* Top 3 Winners */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topThree.map((winner: any) => (
                      <Card
                        key={winner.rank}
                        className={`border-2 ${getRankColor(winner.rank)}`}
                      >
                        <CardHeader className="text-center">
                          <div className="flex justify-center mb-4">
                            {getRankIcon(winner.rank)}
                          </div>
                          <CardTitle className="text-xl">Rank #{winner.rank}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                          <Avatar className="h-24 w-24 mx-auto">
                            <AvatarImage
                              src={winner.profilePic || winner.freelancerId?.profilePic}
                              alt={winner.name || winner.freelancerId?.name}
                            />
                            <AvatarFallback>
                              {(winner.name || winner.freelancerId?.name || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-lg">
                              {winner.name || winner.freelancerId?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Score: {winner.score?.toFixed(2) || 0}
                            </p>
                          </div>
                          {winner.reward?.baseAmount && (
                            <div className="pt-4 border-t">
                              <p className="text-sm text-muted-foreground">Reward</p>
                              <p className="text-2xl font-bold text-green-600">
                                ${winner.reward.baseAmount}
                              </p>
                              {winner.reward.transactionId && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Transaction: {winner.reward.transactionId.slice(0, 8)}
                                  ...
                                </p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* No Winners Message */}
                  {topThree.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <p className="text-muted-foreground">
                          No rankings available for this leaderboard yet.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
            </TabsContent>
          )}

        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
