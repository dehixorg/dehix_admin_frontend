"use client";
import { useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axiosinstance";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"; // Import Tooltip component (if available)

interface Project {
  name: string;
  description: string;
  status: string;
}

function ProjectList({ id }: { id: string }) {
  const [projectid, setProjects] = useState<string[]>([]);
  const [project, setProject] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast(); // Initialize toast

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get(`/business/${id}`);
        const data = response.data;
        if (data.ProjectList) {
          setProjects(data.ProjectList);
        } else {
          toast({
            title: "Error",
            description: "Error in fetching data. Please try again",
            variant: "destructive", // Optional: change the variant as needed
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Error in fetching data. Please try again",
          variant: "destructive", // Optional: change the variant as needed
        });
      } finally {
        setLoading(true);
      }
    };

    fetchProjects();
  }, [id]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectdata: Project[] = [];
        for (const projectId of projectid) {
          const response = await axiosInstance.get(
            `/business/${projectId}/project`,
          );
          const data = response.data.data;
          const info: Project = {
            name: data.projectName,
            description: data.description,
            status: data.status,
          };
          projectdata.push(info);
        }
        if (projectdata.length > 0) {
          setProject(projectdata);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Error in fetching data. Please try again",
          variant: "destructive", // Optional: change the variant as needed
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [projectid]);
  const formatdesc = (desc: string) => {
    if (desc.length <= 90) return desc;
    return `${desc.substring(0, 70)}...${desc.substring(desc.length - 7)}`;
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Project List</h1>

      <Table className="w-full text-white bg-black">
        <TableHeader>
          <TableRow>
            <TableHead>Serial No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-white text-center">
              Loading...
            </TableCell>{" "}
            {/* Center loading message */}
          </TableRow>
        ) : project.length === 0 ? ( // Check if there are no projects
          <TableRow>
            <TableCell colSpan={4} className="text-white text-center">
              No projects found.
            </TableCell>{" "}
            {/* Center no data message */}
          </TableRow>
        ) : (
          <TableBody>
            {project.map((project1, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell> {/* Serial number */}
                <TableCell>{project1.name}</TableCell>
                <TableCell>
                  <span
                    className={
                      project1.status === "Active"
                        ? "text-green-500"
                        : project1.status === "Rejected"
                          ? "text-red-500"
                          : project1.status === "Pending"
                            ? "text-yellow-500"
                            : "text-gray-500" // Fallback for unexpected statuses
                    }
                  >
                    {project1.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      <span>
                        {formatdesc(project1.description || "") ||
                          "No Data Available"}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {project1.description
                        ? project1.description
                        : "No Data Available"}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
}

export default ProjectList;
