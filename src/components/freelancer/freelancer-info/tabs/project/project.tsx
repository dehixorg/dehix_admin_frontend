"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { apiHelperService } from "@/services/freelancer"; // Assuming this service will also have getProjectById
import { useToast } from "@/components/ui/use-toast";
import { Messages } from "@/utils/common/enum";

// Define the interface for a single project detail
interface ProjectDetail {
  _id: string; // Assuming the ID from the backend is _id
  projectName: string;
  status:string;
  // Add other fields you want to display from your project document
  // e.g., description: string;
  // e.g., startDate: string;
}

// Update UserData to hold arrays of ProjectDetail
interface UserData {
  pendingProject: ProjectDetail[];
  rejectedProject: ProjectDetail[];
  acceptedProject: ProjectDetail[];
}

interface ProjectProps {
  id: string;
  profile: any; // Consider making this more specific if possible
}

const Project: React.FC<ProjectProps> = ({ id }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true); // Ensure loading state is true at the start of each fetch
      try {
        const response = await apiHelperService.getAllFreelancerPersonalInfo(id);
        const freelancer = response?.data?.data;
          console.log(freelancer)
        if (!freelancer) {
          throw new Error("No freelancer data found");
        }

        // Destructure only the arrays of IDs
        const {
          pendingProject: pendingProjectIds = [],
          rejectedProject: rejectedProjectIds = [],
          acceptedProject: acceptedProjectIds = [],
        } = freelancer;

        // Function to fetch details for a list of project IDs
        const fetchProjectDetails = async (projectIds: string[]): Promise<ProjectDetail[]> => {
          
          if (projectIds.length === 0) {
            return [];
          }
          // Use Promise.all to fetch all projects concurrently
          const projectPromises = projectIds.map(projectId =>
            apiHelperService.getProjectbyId(projectId).then(res => res.data.data)
          );
          const projects = await Promise.all(projectPromises);
          console.log(projects)
          return projects;
        };

        // Fetch details for each category of projects
        const detailedPendingProjects = await fetchProjectDetails(pendingProjectIds);
        const detailedRejectedProjects = await fetchProjectDetails(rejectedProjectIds);
        const detailedAcceptedProjects = await fetchProjectDetails(acceptedProjectIds);

        setUserData({
          pendingProject: detailedPendingProjects,
          rejectedProject: detailedRejectedProjects,
          acceptedProject: detailedAcceptedProjects,
        });

      } catch (error) {
        console.error("Failed to fetch project data:", error); // Log error for debugging
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("project"),
          variant: "destructive",
        });
        setUserData({ pendingProject: [], rejectedProject: [], acceptedProject: [] }); // Set to empty arrays on error
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAllData();
    }
  }, [id, toast]);

  // Helper function to render project rows
  const renderProjectRows = (projects: ProjectDetail[], status: string) => {
  if (!projects) return null; // Handle case where the array itself might be null/undefined

  return projects
    .filter(project => project != null && project.projectName) // Filter out null/undefined entries and those without a name
    .map((project) => (
      <TableRow key={project._id}>
        <TableCell>{project.projectName}</TableCell>
        <TableCell>{status}</TableCell>
      </TableRow>
    ));
};

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      Loading projects...
                    </TableCell>
                  </TableRow>
                ) : userData && (userData.pendingProject.length > 0 || userData.rejectedProject.length > 0 || userData.acceptedProject.length > 0) ? (
                  <>
                    {renderProjectRows(userData.pendingProject, "Pending")}
                    {renderProjectRows(userData.rejectedProject, "Rejected")}
                    {renderProjectRows(userData.acceptedProject, "Accepted")}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen className="mx-auto text-gray-500" size={100} />
                        <p className="text-gray-500">
                          No projects found.
                          <br /> You haven't been assigned or applied to any projects yet.
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

export default Project;