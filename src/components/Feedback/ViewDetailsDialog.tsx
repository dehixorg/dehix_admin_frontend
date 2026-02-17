"use client";

import React, { useState, useEffect } from "react";
import { Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiHelperService } from "@/services/admin";

interface ViewDetailsDialogProps {
  campaignId: string;
  campaignData?: any;
}

export default function ViewDetailsDialog({
  campaignId,
  campaignData: _campaignData,
}: ViewDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCampaignDetails = async () => {
    setLoading(true);
    try {
      const response =
        await apiHelperService.getFeedbackCampaignById(campaignId);
      setCampaign(response.data.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to load campaign details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCampaignDetails();
    }
  }, [open]);

  const getStatusBadge = () => {
    if (!campaign) return null;

    if (campaign.isArchived) {
      return <Badge variant="destructive">Archived</Badge>;
    }
    return campaign.isActive ? (
      <Badge className="bg-green-500">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const getUserTypeBadge = (userType: string) => {
    const colors: Record<string, string> = {
      FREELANCER: "bg-blue-100 text-blue-800",
      BUSINESS: "bg-green-100 text-green-800",
      ALL: "bg-purple-100 text-purple-800",
    };
    return <Badge className={colors[userType] || ""}>{userType}</Badge>;
  };

  const getQuestionTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      RATING_5_STAR: "bg-yellow-100 text-yellow-800",
      TEXT_AREA: "bg-blue-100 text-blue-800",
      MULTIPLE_CHOICE: "bg-purple-100 text-purple-800",
    };
    return <Badge className={colors[type] || ""}>{type}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Campaign Details</DialogTitle>
          <DialogDescription>
            View complete information about this feedback campaign.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading campaign details...
            </span>
          </div>
        )}

        {!loading && campaign && (
          <div className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold border-b pb-2">
                Basic Information
              </h3>
              <div className="grid gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Title
                  </p>
                  <p className="text-base">{campaign.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Description
                  </p>
                  <p className="text-base">{campaign.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <div className="mt-1">{getStatusBadge()}</div>
                </div>
              </div>
            </div>

            {/* Target Audience Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold border-b pb-2">
                Target Audience
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    User Type
                  </p>
                  <div className="mt-1">
                    {getUserTypeBadge(
                      campaign.targetAudience?.userType || "N/A"
                    )}
                  </div>
                </div>

                {campaign.targetAudience?.minAccountAgeDays && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Minimum Account Age
                    </p>
                    <p className="text-base">
                      {campaign.targetAudience.minAccountAgeDays} days
                    </p>
                  </div>
                )}

                {/* Freelancer Rules */}
                {campaign.targetAudience?.userType === "FREELANCER" &&
                  campaign.targetAudience?.freelancerRules &&
                  Object.keys(campaign.targetAudience.freelancerRules).length >
                    0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Freelancer Requirements
                      </p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Requirement</TableHead>
                            <TableHead>Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {campaign.targetAudience.freelancerRules
                            .minVerifiedDehixTalent !== undefined && (
                            <TableRow>
                              <TableCell>Min Verified Dehix Talent</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.freelancerRules
                                    .minVerifiedDehixTalent
                                }
                              </TableCell>
                            </TableRow>
                          )}
                          {campaign.targetAudience.freelancerRules
                            .minCompletedProjects !== undefined && (
                            <TableRow>
                              <TableCell>Min Completed Projects</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.freelancerRules
                                    .minCompletedProjects
                                }
                              </TableCell>
                            </TableRow>
                          )}
                          {campaign.targetAudience.freelancerRules
                            .minCurrentLevel !== undefined && (
                            <TableRow>
                              <TableCell>Min Current Level</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.freelancerRules
                                    .minCurrentLevel
                                }
                              </TableCell>
                            </TableRow>
                          )}
                          {campaign.targetAudience.freelancerRules
                            .minLongestStreak !== undefined && (
                            <TableRow>
                              <TableCell>Min Longest Streak</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.freelancerRules
                                    .minLongestStreak
                                }
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                {/* Business Rules */}
                {campaign.targetAudience?.userType === "BUSINESS" &&
                  campaign.targetAudience?.businessRules &&
                  Object.keys(campaign.targetAudience.businessRules).length >
                    0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Business Requirements
                      </p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Requirement</TableHead>
                            <TableHead>Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {campaign.targetAudience.businessRules
                            .minProjectCreated !== undefined && (
                            <TableRow>
                              <TableCell>Min Projects Created</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.businessRules
                                    .minProjectCreated
                                }
                              </TableCell>
                            </TableRow>
                          )}
                          {campaign.targetAudience.businessRules
                            .minFreelancerHired !== undefined && (
                            <TableRow>
                              <TableCell>Min Freelancers Hired</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.businessRules
                                    .minFreelancerHired
                                }
                              </TableCell>
                            </TableRow>
                          )}
                          {campaign.targetAudience.businessRules
                            .minDehixTalentHired !== undefined && (
                            <TableRow>
                              <TableCell>Min Dehix Talent Hired</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.businessRules
                                    .minDehixTalentHired
                                }
                              </TableCell>
                            </TableRow>
                          )}
                          {campaign.targetAudience.businessRules
                            .minMoneySpend !== undefined && (
                            <TableRow>
                              <TableCell>Min Money Spent</TableCell>
                              <TableCell>
                                $
                                {
                                  campaign.targetAudience.businessRules
                                    .minMoneySpend
                                }
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold border-b pb-2">
                Questions ({campaign.questions?.length || 0})
              </h3>
              <div className="space-y-4">
                {campaign.questions?.map((question: any, index: number) => (
                  <div
                    key={question._id || index}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-medium">
                        {index + 1}. {question.questionText}
                      </p>
                      {question.isRequired && (
                        <Badge variant="destructive" className="ml-2">
                          Required
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getQuestionTypeBadge(question.type)}
                      {question.type === "MULTIPLE_CHOICE" &&
                        question.options &&
                        question.options.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">
                              Options:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {question.options.map(
                                (option: string, idx: number) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="font-normal"
                                  >
                                    {option}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
                {(!campaign.questions || campaign.questions.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No questions available
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
