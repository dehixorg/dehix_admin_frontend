import React, { useEffect, useState } from "react";
import {
  Mail,
  Briefcase,
  Building,
  Layers,
  CheckCircle,
  Users,
  Link,
  Code,
  Dot,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiHelperService } from "@/services/business";
import { apiHelperService as projectService } from "@/services/project";
import { StatusEnum } from "@/utils/common/enum";
import { useToast } from "@/components/ui/use-toast";

interface DehixProjectInfo {
  projectName: string;
  description: string;
  companyId: string;
  email: string;
  companyName: string;
  skillsRequired: string[];
  role: string;
  projectType: string;
  status: StatusEnum;
  team: string[];
  url: { value: string; _id: string }[];
  createdAt: string;
  updatedAt: string;
}

type ProjectCardProps = React.ComponentProps<typeof Card> & {
  id: string;
};

export function ProjectCard({ id }: ProjectCardProps) {
  const [projectInfo, setProjectInfo] = useState<DehixProjectInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProjectData = async () => {
      setLoading(true);
      setError(null);
      setProjectInfo(null);
      try {
        const response = await apiHelperService.getBusinessProjectbyId(id);
        // Check if the response data array exists and has at least one element
        if (response?.data?.data && response.data.data.length > 0) {
          // Set projectInfo to the first object in the array
          setProjectInfo(response.data.data[0]);
        } else {
          setError("No project data found for this ID.");
        }
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError("Failed to fetch project data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-300";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!projectInfo) return;
    
    setStatusUpdating(true);
    const previousStatus = projectInfo.status;
    
    // Optimistically update UI
    setProjectInfo({ ...projectInfo, status: newStatus as StatusEnum });
    
    try {
      await projectService.updateUserStatus(id, newStatus);
      toast({
        title: "Success",
        description: `Project status updated to ${newStatus}`,
        variant: "default",
      });
    } catch (err) {
      console.error("Error updating project status:", err);
      // Revert to previous status on error
      setProjectInfo({ ...projectInfo, status: previousStatus });
      toast({
        title: "Error",
        description: "Failed to update project status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-7 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-full bg-gray-200 rounded animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-3/5 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-2 mt-4">
            <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!projectInfo) {
    return <p>No project data found.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Briefcase className="mr-2 w-5 h-5 text-gray-500" />
          {projectInfo.projectName}
        </CardTitle>
        <CardDescription className="text-base flex items-center">
          <Dot className="mr-2 w-5 h-5 text-gray-500" />
          {projectInfo.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center">
          <Building className="w-5 h-5 text-gray-500 mr-2" />
          <p className="text-md font-semibold">Company: </p>
          <p className=" ml-2">
            {projectInfo.companyName} ({projectInfo.companyId})
          </p>
        </div>

        <div className="flex items-center">
          <Mail className="w-5 h-5 text-gray-500 mr-2" />
          <p className="text-md font-semibold">Email: </p>
          <p className=" ml-2">{projectInfo.email}</p>
        </div>

        <div className="flex items-center">
          <Briefcase className="w-5 h-5 text-gray-500 mr-2" />
          <p className="text-md font-semibold">Role: </p>
          <p className=" ml-2">{projectInfo.role}</p>
        </div>

        <div className="flex items-center">
          <Layers className="w-5 h-5 text-gray-500 mr-2" />
          <p className="text-md font-semibold">Project Type: </p>
          <p className=" ml-2">{projectInfo.projectType}</p>
        
        </div>

        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-gray-500 mr-2" />
          <p className="text-md font-semibold">Status: </p>
          <Select
            value={projectInfo.status}
            onValueChange={handleStatusChange}
            disabled={statusUpdating}
          >
            <SelectTrigger className="w-[180px] ml-2">
              <span className={`inline-block px-3 py-1 border rounded-md text-sm font-semibold ${getStatusStyle(projectInfo.status)}`}>
                {projectInfo.status}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
              <SelectItem value="REJECTED">REJECTED</SelectItem>
              <SelectItem value="COMPLETED">COMPLETED</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {projectInfo.skillsRequired && projectInfo.skillsRequired.length > 0 && (
          <div>
            <div className="flex items-center">
              <Code className="w-5 h-5 text-gray-500 mr-2" />
              <strong>Skills Required:</strong>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {projectInfo.skillsRequired.map((skill, index) => (
                <Badge key={index} className="px-3 py-1 rounded-full">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {projectInfo.team && projectInfo.team.length > 0 && (
          <div className="flex items-center">
            <Users className="w-5 h-5 text-gray-500 mr-2" />
            <p className="text-md font-semibold">Team: </p>
            <p className=" ml-2">{projectInfo.team.join(", ")}</p>
          </div>
        )}

        {projectInfo.url && projectInfo.url.length > 0 && (
          <div>
            <div>
              <div className="flex items-center">
                <Link className="w-5 h-5 text-gray-500 mr-2" />
                <strong>URL:</strong>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                {projectInfo.url.map((urlItem) => (
                  <a
                    key={urlItem._id}
                    href={urlItem.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    {urlItem.value}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex justify-between">
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(projectInfo.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(projectInfo.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}