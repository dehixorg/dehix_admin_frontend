"use client";

import React, { useState, useEffect } from "react";
import { Eye, Loader2, ChevronDown, ChevronUp, Star } from "lucide-react";
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

interface ViewSubmissionsProps {
  campaignId: string;
}

interface Answer {
  questionId: string;
  questionText: string;
  type: string;
  response: string | number;
}

interface Submission {
  _id: string;
  userId: string;
  userType: "FREELANCER" | "BUSINESS";
  submittedAt: string;
  answers: Answer[];
}

export default function ViewSubmissions({ campaignId }: ViewSubmissionsProps) {
  const [open, setOpen] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response =
        await apiHelperService.getFeedbackCampaignSubmissions(campaignId);
      setSubmissions(response.data.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to load submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSubmissions();
    }
  }, [open]);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderResponse = (answer: Answer) => {
    if (answer.type === "RATING_5_STAR") {
      const rating = Number(answer.response);
      return (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            ({rating}/5)
          </span>
        </div>
      );
    }

    if (answer.type === "TEXT_AREA") {
      return (
        <p className="text-sm whitespace-pre-wrap max-w-md">
          {answer.response}
        </p>
      );
    }

    if (answer.type === "MULTIPLE_CHOICE") {
      return (
        <Badge variant="outline" className="font-normal">
          {answer.response}
        </Badge>
      );
    }

    return <span className="text-sm">{answer.response}</span>;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Campaign Submissions</DialogTitle>
          <DialogDescription>
            View all feedback submissions for this campaign.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Eye className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No submissions yet
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Submissions will appear here once users complete the feedback.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Total Submissions:{" "}
              <span className="font-medium">{submissions.length}</span>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead className="text-right">Responses</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <React.Fragment key={submission._id}>
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(submission._id)}
                        >
                          {expandedRows.has(submission._id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {submission.userId.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            submission.userType === "FREELANCER"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {submission.userType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(submission.submittedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        {submission.answers?.length || 0} answers
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(submission._id) && (
                      <TableRow>
                        <TableCell colSpan={5} className="bg-muted/30">
                          <div className="p-4 space-y-4">
                            <h4 className="font-semibold text-sm mb-3">
                              Answers:
                            </h4>
                            {submission.answers?.map((answer, index) => (
                              <div
                                key={index}
                                className="border-l-2 border-primary pl-4 py-2"
                              >
                                <p className="font-medium text-sm mb-2">
                                  {answer.questionText}
                                </p>
                                <div className="ml-2">
                                  {renderResponse(answer)}
                                </div>
                              </div>
                            ))}
                            {(!submission.answers ||
                              submission.answers.length === 0) && (
                              <p className="text-sm text-muted-foreground italic">
                                No answers recorded
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
