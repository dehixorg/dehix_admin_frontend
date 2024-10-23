import React, { useState, useEffect } from "react";
import { PackageOpen, Eye } from "lucide-react";

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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { apiHelperService } from "@/services/interview";

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
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewData | null>(null);
  const { toast } = useToast();

  const fetchInterviewData = async () => {
    setLoading(true);
    setNoData(false);
    try {
      const response = await apiHelperService.getAllInterview();
      if (!response.data || response.data.length === 0) {
        setNoData(true);
      } else {
        setInterviewData(response.data.data);
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
  const formatID = (id: string) => {
    if (id.length <= 7) return id;
    return `${id.substring(0, 5)}...${id.substring(id.length - 2)}`;
  };

  useEffect(() => {
    fetchInterviewData();
  }, []);

  return (
    <div className="px-4">
      <div className="mb-8 mt-4 mr-4">
        <div className="flex-grow mb-4">
          <h2 className="text-xl font-semibold">Interview Table</h2>
        </div>
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
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
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
                        <Tooltip>
                          <TooltipTrigger>
                            <span>
                              {formatID(interview._id || "") ||
                                "No Data Available"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {interview._id
                              ? interview._id
                              : "No Data Available"}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <span>
                              {formatID(interview.interviewer || "") ||
                                "No Data Available"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {interview.interviewer
                              ? interview.interviewer
                              : "No Data Available"}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <span>
                              {formatID(interview.interviewee || "") ||
                                "No Data Available"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {interview.interviewee
                              ? interview.interviewee
                              : "No Data Available"}
                          </TooltipContent>
                        </Tooltip>
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
                            <Button
                              variant="outline"
                              onClick={() => setSelectedInterview(interview)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
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
                ) : (
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
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InterviewTable;
