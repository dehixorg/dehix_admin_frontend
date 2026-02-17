"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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


import { ButtonIcon } from "@/components/ui/arrowButton";
import { formatID, Messages, StatusEnum } from "@/utils/common/enum";
import { Badge } from "@/components/ui/badge";
import { getStatusBadge } from "@/utils/common/utils";
import CopyButton from "@/components/copybutton";

interface Project {
  _id: string;
  projectName: string;
  description: string;
  status: StatusEnum;
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
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiHelperService.getAllBusinessProject(id);

        if (response.data.data) {
          setProject(response.data.data);
        } else {
          toast({
            title: "Error",
            description: Messages.FETCH_ERROR("projects"),
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("projects"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [id, toast]);

  const handleProject = (projectId: string) => {
    router.push(`/project/tabs?id=${projectId}`);
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            </TableBody>
          ) : project.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No projects found.
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {project.map((project1) => (
                <TableRow key={project1._id}>
                  <TableCell>
                    {project1._id ? (
                      <div className="flex items-center space-x-2">
                        <Tooltip>
                          <TooltipTrigger>
                            <span>{formatID(project1._id || "")}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {project1._id || "No Data Available"}
                          </TooltipContent>
                        </Tooltip>
                        <CopyButton id={project1._id || ""} />
                      </div>
                    ) : (
                      "No Data Available"
                    )}
                  </TableCell>
                  <TableCell>{project1.projectName}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(project1.status)}>
                      {project1.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(project1.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(project1.updatedAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <ButtonIcon onClick={() => handleProject(project1._id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}

export default ProjectList;