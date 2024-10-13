"use client";
import { useEffect, useState } from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { apiHelperService } from "@/services/business";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ButtonIcon } from "@/components/ui/eyeButton"; // Icon for the eye button
import { formatID } from "@/utils/common/enum";

interface Project {
  _id: string;
  projectName: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  skillsRequired: string[];
  projectDomain: string[];
  email: string;
  url: string[];
}

function ProjectList({ id }: { id: string }) {
  const [project, setProject] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiHelperService.getAllBusinessProject(id);
        const data = response.data;
        console.log(data.data);
        setProject(data.data || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error in fetching data. Please try again",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Project List</h1>

      <Table className="w-full text-white bg-black">
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-white text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : project.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-white text-center">
              No projects found.
            </TableCell>
          </TableRow>
        ) : (
          <TableBody>
            {project.map((project1, index) => (
              <TableRow key={project1._id}>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      <span>{formatID(project1._id)}</span>
                    </TooltipTrigger>
                    <TooltipContent>{project1._id}</TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>{project1.projectName}</TableCell>
                <TableCell>
                  <span
                    className={
                      project1.status === "Active"
                        ? "text-green-500"
                        : project1.status === "Rejected"
                          ? "text-red-500"
                          : project1.status === "Pending"
                            ? "text-yellow-500"
                            : "text-gray-500"
                    }
                  >
                    {project1.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(project1.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(project1.updatedAt).toLocaleString()}
                </TableCell>

                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <ButtonIcon></ButtonIcon>
                    </DialogTrigger>

                    <DialogContent className="p-4">
                      <DialogHeader>
                        <DialogTitle>Project Details</DialogTitle>
                      </DialogHeader>
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          {project1.projectName}
                        </h3>

                        <div className="mb-2">
                          <strong>Status:</strong>
                          <span
                            className={
                              project1.status === "Active"
                                ? "text-green-500"
                                : project1.status === "Rejected"
                                  ? "text-red-500"
                                  : project1.status === "Pending"
                                    ? "text-yellow-500"
                                    : "text-gray-500"
                            }
                          >
                            {project1.status}
                          </span>
                        </div>

                        <div className="mb-2">
                          <strong>Description:</strong>{" "}
                          {project1.description || "No Data Available"}
                        </div>

                        <div className="mb-2">
                          <strong>Email:</strong>{" "}
                          {project1.email || "No Data Available"}
                        </div>

                        <div className="mb-2">
                          <strong>Skills Required:</strong>{" "}
                          {project1.skillsRequired.length > 0
                            ? project1.skillsRequired.join(", ")
                            : "No skills specified"}
                        </div>

                        <div className="mb-2">
                          <strong>Project Domains:</strong>{" "}
                          {project1.projectDomain.length > 0
                            ? project1.projectDomain.join(", ")
                            : "No domains specified"}
                        </div>

                        <div className="mb-2">
                          <strong>Url:</strong>{" "}
                          {project1.url.length > 0
                            ? project1.url.join(", ")
                            : "No url specified"}
                        </div>

                        <div className="mb-2">
                          <strong>Created At:</strong>{" "}
                          {new Date(project1.createdAt).toLocaleString()}
                        </div>

                        <div className="mb-2">
                          <strong>Updated At:</strong>{" "}
                          {new Date(project1.updatedAt).toLocaleString()}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
