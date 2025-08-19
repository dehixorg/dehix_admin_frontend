"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
import Link from "next/link"; // Import the Link component

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { apiHelperService } from "@/services/freelancer";
import { useToast } from "@/components/ui/use-toast";
import { Messages } from "@/utils/common/enum";

// Define the interface for a single project detail
interface ProjectDetail {
  _id: string;
  projectName: string;
  status: string;
  // Add other fields you want to display from your project document
}

// Update UserData to hold arrays of ProjectDetail
interface UserData {
  pendingProject: ProjectDetail[];
  rejectedProject: ProjectDetail[];
  acceptedProject: ProjectDetail[];
}

interface ProjectProps {
  id: string;
}

const Project: React.FC<ProjectProps> = ({ id }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const response = await apiHelperService.getAllFreelancerPersonalInfo(id);
        const freelancer = response?.data?.data;
        if (!freelancer) {
          throw new Error("No freelancer data found");
        }

        const {
          pendingProject: pendingProjectIds = [],
          rejectedProject: rejectedProjectIds = [],
          acceptedProject: acceptedProjectIds = [],
        } = freelancer;

        const fetchProjectDetails = async (
          projectIds: string[]
        ): Promise<ProjectDetail[]> => {
          if (projectIds.length === 0) {
            return [];
          }
          const projectPromises = projectIds.map((projectId) =>
            apiHelperService.getProjectbyId(projectId).then((res) => res.data.data)
          );
          const projects = await Promise.all(projectPromises);
          return projects;
        };

        const detailedPendingProjects = await fetchProjectDetails(
          pendingProjectIds
        );
        const detailedRejectedProjects = await fetchProjectDetails(
          rejectedProjectIds
        );
        const detailedAcceptedProjects = await fetchProjectDetails(
          acceptedProjectIds
        );

        setUserData({
          pendingProject: detailedPendingProjects,
          rejectedProject: detailedRejectedProjects,
          acceptedProject: detailedAcceptedProjects,
        });
      } catch (error) {
        console.error("Failed to fetch project data:", error);
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("project"),
          variant: "destructive",
        });
        setUserData({
          pendingProject: [],
          rejectedProject: [],
          acceptedProject: [],
        });
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
    if (!projects) return null;

    return projects
      .filter((project) => project != null && project.projectName)
      .map((project) => (
        <TableRow key={project._id}>
          <TableCell>
            {/* Use the Link component for routing */}
            <Link
              href={`/project/tabs?id=${project._id}`}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {project.projectName}
            </Link>
          </TableCell>
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
                ) : userData &&
                  (userData.pendingProject.length > 0 ||
                    userData.rejectedProject.length > 0 ||
                    userData.acceptedProject.length > 0) ? (
                  <>
                    {renderProjectRows(userData.pendingProject, "Pending")}
                    {renderProjectRows(userData.rejectedProject, "Rejected")}
                    {renderProjectRows(userData.acceptedProject, "Accepted")}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen
                          className="mx-auto text-gray-500"
                          size={100}
                        />
                        <p className="text-gray-500">
                          No projects found.
                          <br /> You haven't been assigned or applied to any
                          projects yet.
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