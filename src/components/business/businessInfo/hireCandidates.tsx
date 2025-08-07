"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PackageOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import CopyButton from "@/components/copybutton";
import { Messages } from "@/utils/common/enum";
import { apiHelperService } from "@/services/business";
import { useToast } from "@/components/ui/use-toast";

// --- INTERFACES (as per your previous definitions) ---
interface FreelancerDetail {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface BusinessProjectData {
  _id: string;
  businessId: string;
  skillId?: string;
  skillName?: string;
  description: string;
  domainId?: string;
  domainName?: string;
  experience: string;
  status: string;
  visible: boolean;
  freelancerRequired: number;
  freelancerInLobby: { _id: string; freelancerId: string; dehixTalentId: string }[];
  freelancerSelected: { _id: string; freelancerId: string; dehixTalentId: string }[];
  freelancerInvited: { _id: string; freelancerId: string; status: string }[];
  freelancerRejected: { _id: string; freelancerId: string; dehixTalentId: string }[];
  createdAt: string;
  updatedAt: string;
  bookmarked: boolean;
}
// --- END INTERFACES ---

interface HirefreelancerProps {
  businessId: string;
}

function Hirefreelancer({ businessId }: HirefreelancerProps) {
  const [projectData, setProjectData] = useState<BusinessProjectData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [freelancerDetailsMap, setFreelancerDetailsMap] = useState<Map<string, FreelancerDetail>>(new Map());
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchFreelancerInfo = async () => {
      if (!businessId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const projectsResponse = await apiHelperService.getBusinessHireProjects(businessId);
        let fetchedBaseProjects: BusinessProjectData[] = [];

        if (projectsResponse?.data?.data) {
          if (Array.isArray(projectsResponse.data.data)) {
            fetchedBaseProjects = projectsResponse.data.data;
          } else {
            fetchedBaseProjects = [projectsResponse.data.data];
          }
        }
        setProjectData(fetchedBaseProjects);

        const uniqueFreelancerIds = new Set<string>();
        fetchedBaseProjects.forEach(project => {
          project.freelancerInLobby.forEach(f => uniqueFreelancerIds.add(f.freelancerId));
          project.freelancerSelected.forEach(f => uniqueFreelancerIds.add(f.freelancerId));
          project.freelancerInvited.forEach(f => uniqueFreelancerIds.add(f.freelancerId));
          project.freelancerRejected.forEach(f => uniqueFreelancerIds.add(f.freelancerId));
        });

        const newFreelancerDetails = new Map<string, FreelancerDetail>(freelancerDetailsMap);
        const fetchPromises = Array.from(uniqueFreelancerIds).map(async (id) => {
          if (!newFreelancerDetails.has(id)) {
            try {
              const freelancerResponse = await apiHelperService.getAllFreelancerPersonalInfo(id);
              if (freelancerResponse?.data?.data) {
                newFreelancerDetails.set(id, freelancerResponse.data.data);
              } else {
                console.warn(`Freelancer detail not found for ID: ${id}.`);
              }
            } catch (error) {
              console.error(`Error fetching freelancer detail for ID ${id}:`, error);
              toast({
                title: "Error",
                description: `Failed to load details for freelancer ${id}.`,
                variant: "destructive",
              });
            }
          }
        });
        await Promise.allSettled(fetchPromises);
        setFreelancerDetailsMap(newFreelancerDetails);

      } catch (error) {
        console.error("Error fetching project data:", error);
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("project data"),
          variant: "destructive",
        });
        setProjectData([]);
        setFreelancerDetailsMap(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerInfo();
  }, [businessId, toast]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">Loading freelancer data...</p>
      </div>
    );
  }

  if (!projectData || projectData.length === 0) {
    return (
      <div className="text-center py-10">
        <PackageOpen className="mx-auto text-gray-500 dark:text-gray-400" size={100} />
        <p className="text-gray-500 dark:text-gray-400">No projects or freelancer data found for this business.</p>
      </div>
    );
  }

  const handleFreelancerClick = (freelancerId: string) => {
    router.push(`/freelancer/tabs?id=${freelancerId}`);
  };

  return (
    <Card className="w-full max-w p-4">
      <CardHeader>
        <CardTitle>Project-Based Freelancer Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial No.</TableHead>
              <TableHead>Project ID / Skill</TableHead>
              <TableHead>Lobby Count</TableHead>
              <TableHead>Selected Freelancers</TableHead>
              <TableHead>Invited Freelancers</TableHead>
              <TableHead>Rejected Freelancers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectData.map((project, projectIndex) => (
              <TableRow key={project._id}>
                <TableCell className="py-2">{projectIndex + 1}</TableCell>
                <TableCell className="py-2">
                  <div className="flex flex-col">
                    <span className="font-semibold text-blue-700 dark:text-blue-400">{project.skillName || project.domainName}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">ID: {project._id} <CopyButton id={project._id} /></span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status: {project.status}</span>
                  </div>
                </TableCell>
                <TableCell className="py-2 text-center font-bold text-gray-800 dark:text-gray-200">
                  {project.freelancerInLobby?.length || 0}
                </TableCell>
                <TableCell className="py-2">
                  {project.freelancerSelected && project.freelancerSelected.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200">
                      {project.freelancerSelected.map((f, i) => {
                        const freelancer = freelancerDetailsMap.get(f.freelancerId);
                        return (
                          <li key={f._id || i} className="flex items-center space-x-1">
                            {freelancer ? (

                              <a

                                onClick={() => handleFreelancerClick(freelancer._id)}
                                className="cursor-pointer text-blue-600 dark:text-blue-300 hover:underline"
                                title={`View ${freelancer.firstName} ${freelancer.lastName}'s profile`}
                              >
                                {`${freelancer.firstName} ${freelancer.lastName}`}
                              </a>

                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">Unknown Freelancer</span>
                            )}
                            {freelancer && <CopyButton id={freelancer._id} />}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="py-2">
                  {project.freelancerInvited && project.freelancerInvited.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200">
                      {project.freelancerInvited.map((f, i) => {
                        const freelancer = freelancerDetailsMap.get(f.freelancerId);
                        return (
                          <li key={f._id || i} className="flex items-center space-x-1">
                            {freelancer ? (
                              <a

                                onClick={() => handleFreelancerClick(freelancer._id)}
                                className="cursor-pointer text-blue-600 dark:text-blue-300 hover:underline"
                                title={`View ${freelancer.firstName} ${freelancer.lastName}'s profile`}
                              >
                                {`${freelancer.firstName} ${freelancer.lastName}`}
                              </a>

                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">Unknown Freelancer</span>
                            )}
                            {freelancer && <CopyButton id={freelancer._id} />}
                            {f.status && <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({f.status})</span>}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="py-2">
                  {project.freelancerRejected && project.freelancerRejected.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200">
                      {project.freelancerRejected.map((f, i) => {
                        const freelancer = freelancerDetailsMap.get(f.freelancerId);
                        return (
                          <li key={f._id || i} className="flex items-center space-x-1">
                            {freelancer ? (
                              <a

                                onClick={() => handleFreelancerClick(freelancer._id)}
                                className="cursor-pointer text-blue-600 dark:text-blue-300 hover:underline"
                                title={`View ${freelancer.firstName} ${freelancer.lastName}'s profile`}
                              >
                                {`${freelancer.firstName} ${freelancer.lastName}`}
                              </a>

                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">Unknown Freelancer</span>
                            )}
                            {freelancer && <CopyButton id={freelancer._id} />}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default Hirefreelancer;