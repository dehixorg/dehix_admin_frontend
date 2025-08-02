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
import { apiHelperService } from "@/services/freelancer"; // Service to get freelancer and project details
import { useToast } from "@/components/ui/use-toast"; // For showing notifications
import { Messages } from "@/utils/common/enum"; // For consistent messaging

// --- This is the data structure for a single, detailed project ---
interface ProjectDetail {
  _id: string;
  projectName: string;
  status: string;
  // You can add any other fields from the project document you need
}

// --- Component Props ---
interface OracleProjectProps {
  id: string; // The ID of the freelancer
  profile: any;
}

const OracleProject: React.FC<OracleProjectProps> = ({ id }) => {
  // State to hold the final, detailed list of oracle projects
  const [projects, setProjects] = useState<ProjectDetail[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOracleProjects = async () => {
      setLoading(true);
      try {
        // 1. Fetch the freelancer's data to get the list of project IDs
        const response = await apiHelperService.getAllFreelancerPersonalInfo(id);
        const projectIds: string[] = response?.data?.data?.oracleProject || [];

        if (projectIds.length === 0) {
          setProjects([]); // No projects to fetch, set state to empty
          return;
        }

        // 2. Fetch the full details for each project ID concurrently
        const projectPromises = projectIds.map((projectId) =>
          apiHelperService.getProjectbyId(projectId).then((res) => res.data.data)
        );
        
        // Wait for all API calls to complete
        const detailedProjects = await Promise.all(projectPromises);

        // 3. Update the state with the fully detailed projects
        // We filter out any null results that might have occurred if a project was deleted
        setProjects(detailedProjects.filter(p => p != null));

      } catch (error) {
        console.error("Failed to fetch oracle project data:", error);
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("verification projects"),
          variant: "destructive",
        });
        setProjects([]); // Set to empty on error to prevent crashes
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOracleProjects();
    }
  }, [id, toast]);

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
                      Loading verification projects...
                    </TableCell>
                  </TableRow>
                ) : projects && projects.length > 0 ? (
                  projects.map((project) => (
                    <TableRow key={project._id}>
                      <TableCell>{project.projectName}</TableCell>
                      <TableCell>{project.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen className="mx-auto text-gray-500" size={100} />
                        <p className="text-gray-500">
                          No verification projects available.
                          <br />
                          Once assigned, they will appear here.
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

export default OracleProject;