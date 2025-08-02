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
import { InfoButton } from "@/components/ui/InfoButton";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { apiHelperService } from "@/services/interview";
import { formatID } from "@/utils/common/enum";
import CopyButton from "@/components/copybutton";
import InterviewTableSkeleton from "@/utils/common/skeleton";

// Assuming services for freelancers, skills, and domains exist
import { apiHelperService as freelancerApiService } from "@/services/business";
import { apiHelperService as skillApiService } from "@/services/skill"; // Path to your skill service
import { apiHelperService as domainApiService } from "@/services/domain"; // Path to your domain service

// Define the structure for freelancer personal info
interface FreelancerPersonalInfo {
  _id: string;
  name: string; // This will store the firstName
}

// Define interfaces for Skill and Domain
interface SkillData {
  _id: string;
  label: string;
  description:string;
}

interface DomainData {
  _id: string;
  label: string;
  description:string;
}

interface InterviewData {
  _id: string;
  interviewerId: string;
  intervieweeId: string;
  skill?: string;
  domain?: string;
  interviewDate: string; 
  rating: number;
  talentType: "skill" | "domain"; 
  talentId: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
}

const InterviewTable: React.FC = () => {
  const [interviewData, setInterviewData] = useState<InterviewData[]>([]);
  const [freelancerDetails, setFreelancerDetails] = useState<Record<string, FreelancerPersonalInfo>>({});
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const { toast } = useToast();

  const [openTalentDialog, setOpenTalentDialog] = useState(false);
  const [selectedTalentDetails, setSelectedTalentDetails] = useState<any | null>(null);
  const [selectedTalentType, setSelectedTalentType] = useState<"skill" | "domain" | null>(null);

  /**
   * Fetches personal details for a list of unique freelancer IDs.
   * Stores them in a map where key is freelancer ID and value is their details.
   * @param ids An array of freelancer IDs.
   * @returns A promise that resolves to a map of freelancer IDs to their details.
   */
  const fetchFreelancerDetails = async (ids: string[]): Promise<Record<string, FreelancerPersonalInfo>> => {
    const detailsMap: Record<string, FreelancerPersonalInfo> = {};
    const uniqueIds = Array.from(new Set(ids.filter(Boolean)));

    if (uniqueIds.length === 0) {
      return detailsMap;
    }

    try {
      const detailPromises = uniqueIds.map(async (id) => {
        try {
          const response = await freelancerApiService.getAllFreelancerPersonalInfo(id);
          if (response?.data?.data?.firstName) {
            detailsMap[id] = {
              _id: id,
              name: response.data.data.firstName,
            };
          } else {
            detailsMap[id] = { _id: id, name: "Unknown Freelancer" };
          }
        } catch (innerError) {
          console.error(`Failed to fetch freelancer details for ID ${id}:`, innerError);
          detailsMap[id] = { _id: id, name: "Unknown Freelancer" };
        }
      });
      await Promise.all(detailPromises);
    } catch (error) {
      console.error("Error fetching freelancer details:", error);
    }
    return detailsMap;
  };

  /**
   * Fetches interview data and then enriches it with freelancer names.
   */
  const fetchAllData = async () => {
  setLoading(true);
  setNoData(false);
  try {
    const interviewResponse = await apiHelperService.getAllInterview();
    let rawInterviewData: InterviewData[] = interviewResponse.data.data || [];

    if (!rawInterviewData || rawInterviewData.length === 0) {
      setNoData(true);
      setInterviewData([]);
      setFreelancerDetails({});
    } else {
      // 🔽 Normalize talentType here
      rawInterviewData = rawInterviewData.map((interview) => ({
        ...interview,
        talentType: interview.talentType?.toLowerCase() as "skill" | "domain",
      }));

      const allFreelancerIds = [
        ...rawInterviewData.map((d) => d.interviewerId),
        ...rawInterviewData.map((d) => d.intervieweeId),
      ].filter(Boolean);

      const fetchedFreelancerDetails = await fetchFreelancerDetails(allFreelancerIds);
      setFreelancerDetails(fetchedFreelancerDetails);
      setInterviewData(rawInterviewData);
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch interview data. Please refresh the page.",
      variant: "destructive",
    });
    setNoData(true);
    setInterviewData([]);
    setFreelancerDetails({});
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchAllData();
  }, []);

  const getTalentDetails = async (talentType: "skill" | "domain", talentId: string): Promise<any | null> => {
    try {
      if (talentType === "skill") {
        const response = await skillApiService.getSkillbyId(talentId); // Assuming a getSkillById functio]n
        console.log(response.data)
        return response?.data?.data || null;
      } else if (talentType === "domain") {
        const response = await domainApiService.getDomainbyId(talentId); // Assuming a getDomainById function
        return response?.data?.data || null;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching ${talentType} details for ID ${talentId}:`, error);
      return null;
    }
  };

  const handleViewTalentDetails = async (talentType: "skill" | "domain", talentId: string) => {
    setSelectedTalentType(talentType);
    const details = await getTalentDetails(talentType, talentId);
    setSelectedTalentDetails(details);
    setOpenTalentDialog(true);
  };

  // Helper function to get freelancer name from the details map
  const getFreelancerName = (id: string | undefined): string => {
    if (!id) return "No Data Available";
    return freelancerDetails[id]?.name || formatID(id);
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4 mr-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="table-title">Interview Table</h2>
        </div>
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Interview ID</TableHead>
                  <TableHead className="w-[180px]">Interviewer</TableHead>
                  <TableHead className="w-[180px]">Interviewee</TableHead>
                  <TableHead className="w-[180px]">Talent Type</TableHead> {/* This column will be clickable */}
                  <TableHead className="w-[180px]">Interview Date</TableHead>
                  <TableHead className="w-[40px]">Rating</TableHead>
                  <TableHead className="w-[20px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <InterviewTableSkeleton />
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
                        {interview.interviewerId ? (
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger>
                                <a
                                  href={`/freelancer/tabs?id=${interview.interviewerId}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {getFreelancerName(interview.interviewerId)}
                                </a>
                              </TooltipTrigger>
                              <CopyButton id={interview.interviewerId || ""} />
                              <TooltipContent>
                                {interview.interviewerId || "No Interviewer"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          "No Interviewer"
                        )}
                      </TableCell>
                      <TableCell>
                        {interview.intervieweeId ? (
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger>
                                <a
                                  href={`/freelancers/${interview.intervieweeId}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {getFreelancerName(interview.intervieweeId)}
                                </a>
                              </TooltipTrigger>
                              <CopyButton id={interview.intervieweeId || ""} />
                              <TooltipContent>
                                {interview.intervieweeId || "No Data Available"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          "No Interviewee"
                        )}
                      </TableCell>
                      <TableCell>
                        {interview.talentType && interview.talentId ? (
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() =>
                              handleViewTalentDetails(interview.talentType, interview.talentId)
                            }
                          >
{interview.talentType === "skill"
  ? (interview.skill || "View Talent")
  : (interview.domain || "View Talent")}
                          </button>
                        ) : (
                          "No Data Available"
                        )}
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
                            <InfoButton />
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
                                <strong>Interviewer ID:</strong>{" "}
                                {interview.interviewerId || "No Data Available"}
                              </p>
                              <p>
                                <strong>Interviewer Name:</strong>{" "}
                                {getFreelancerName(interview.interviewerId)}
                              </p>
                              <p>
                                <strong>Interviewee ID:</strong>{" "}
                                {interview.intervieweeId || "No Data Available"}
                              </p>
                              <p>
                                <strong>Interviewee Name:</strong>{" "}
                                {getFreelancerName(interview.intervieweeId)}
                              </p>
                              <p>
                                <strong>Skill/Domain:</strong>{" "}
                                {interview.skill || interview.domain || "No Data Available"}
                              </p>
                              <p>
                                <strong>Talent Type:</strong>{" "}
                                {interview.talentType || "No Data Available"}
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

        {/* Talent Details Dialog */}
        <Dialog open={openTalentDialog} onOpenChange={setOpenTalentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedTalentType === "skill" ? "Skill Details" : "Domain Details"}
              </DialogTitle>
            </DialogHeader>
            {selectedTalentDetails ? (
              <div className="space-y-2">
                {selectedTalentType === "skill" ? (
                  <>
                    <p><strong>Skill ID:</strong> {selectedTalentDetails._id}</p>
                    <p><strong>Skill Name:</strong> {selectedTalentDetails.label}</p>
                    {/* Add more skill-specific details here if available in your API response */}
                    {selectedTalentDetails.description && <p><strong>Description:</strong> {selectedTalentDetails.description}</p>}
                  </>
                ) : (
                  <>
                    <p><strong>Domain ID:</strong> {selectedTalentDetails._id}</p>
                    <p><strong>Domain Name:</strong> {selectedTalentDetails.label}</p>
                    {/* Add more domain-specific details here if available in your API response */}
                    {selectedTalentDetails.description && <p><strong>Description:</strong> {selectedTalentDetails.description}</p>}
                  </>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No {selectedTalentType} data found.</p>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default InterviewTable;