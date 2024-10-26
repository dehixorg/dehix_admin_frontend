import React, { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ButtonIcon } from "@/components/ui/arrowButton";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { apiHelperService } from "@/services/interview";
import { formatID } from "@/utils/common/enum";
import CopyButton from "@/components/copybutton";
import InterviewTableSkeleton from "@/utils/common/InterviewTableSkeleton"; // Import the new skeleton component

interface InterviewData {
  _id: string;
  interviewer: string;
  interviewee: string;
  skill: string;
  interviewDate: string; // ISO date string
  rating: number;
  comments: string;
  createdAt: string;
  updatedAt: string;
}

const InterviewTable: React.FC = () => {
  const [interviewData, setInterviewData] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const { toast } = useToast();

  const fetchInterviewData = async () => {
    setLoading(true);
    setNoData(false);
    try {
      const response = await apiHelperService.getAllInterview();
      if (!response.data || response.data.length === 0) {
        setNoData(true);
      } else {
        setInterviewData(response.data.data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch interview data. Please refresh the page.",
        variant: "destructive",
      });
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewData();
  }, []);

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Interview ID</TableHead>
                  <TableHead className="w-[180px]">Interviewer</TableHead>
                  <TableHead className="w-[180px]">Interviewee</TableHead>
                  <TableHead className="w-[180px]">Skill</TableHead>
                  <TableHead className="w-[180px]">Interview Date</TableHead>
                  <TableHead className="w-[40px]">Rating</TableHead>
                  <TableHead className="w-[20px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <InterviewTableSkeleton /> // Use the new skeleton component
                ) : noData ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen
                          className="mx-auto text-gray-500"
                          size="100"
                        />
                        <p className="text-gray-500">
                          No data available.
                          <br /> This feature will be available soon.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : interviewData.length > 0 ? (
                  interviewData.map((interview) => (
                    <TableRow key={interview._id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Tooltip>
                            <TooltipTrigger>
                              <span>{formatID(interview._id)}</span>
                            </TooltipTrigger>

                            <CopyButton id={interview._id} />

                            <TooltipContent>
                              {interview._id || "No Data Available"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell>
                        {interview.interviewer ? (
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger>
                                <span>
                                  {formatID(interview.interviewer || "")}
                                </span>
                              </TooltipTrigger>

                              <CopyButton id={interview.interviewer || ""} />

                              <TooltipContent>
                                {interview.interviewer || "No Data Available"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          "No Data Available"
                        )}
                      </TableCell>
                      <TableCell>
                        {interview.interviewee ? (
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger>
                                <span>
                                  {formatID(interview.interviewee || "")}
                                </span>
                              </TooltipTrigger>

                              <CopyButton id={interview.interviewee || ""} />

                              <TooltipContent>
                                {interview.interviewee || "No Data Available"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          "No Data Available"
                        )}
                      </TableCell>
                      <TableCell>
                        {interview.skill || "No Data Available"}
                      </TableCell>
                      <TableCell>
                        {new Date(interview.interviewDate).toLocaleString() ||
                          "No Data Available"}
                      </TableCell>
                      <TableCell className="text-center">
                        {interview.rating == null
                          ? "No Data Available"
                          : interview.rating}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <ButtonIcon />
                          </DialogTrigger>
                          <DialogContent className="p-4">
                            <DialogHeader>
                              <DialogTitle>Interview Details</DialogTitle>
                            </DialogHeader>
                            <div>
                              <p>
                                <strong>ID:</strong>{" "}
                                {interview._id || "No Data Available"}
                              </p>
                              <p>
                                <strong>Interviewer:</strong>{" "}
                                {interview.interviewer || "No Data Available"}
                              </p>
                              <p>
                                <strong>Interviewee:</strong>{" "}
                                {interview.interviewee || "No Data Available"}
                              </p>
                              <p>
                                <strong>Skill:</strong>{" "}
                                {interview.skill || "No Data Available"}
                              </p>
                              <p>
                                <strong>Interview Date:</strong>{" "}
                                {new Date(
                                  interview.interviewDate,
                                ).toLocaleString() || "No Data Available"}
                              </p>
                              <p>
                                <strong>Rating:</strong>{" "}
                                {interview.rating == null
                                  ? "No Data Available"
                                  : interview.rating}
                              </p>
                              <p>
                                <strong>Comments:</strong>{" "}
                                {interview.comments || "No Data Available"}
                              </p>
                              <p>
                                <strong>Created At:</strong>{" "}
                                {new Date(
                                  interview.createdAt,
                                ).toLocaleString() || "No Data Available"}
                              </p>
                              <p>
                                <strong>Updated At:</strong>{" "}
                                {new Date(
                                  interview.updatedAt,
                                ).toLocaleString() || "No Data Available"}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : null}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InterviewTable;
