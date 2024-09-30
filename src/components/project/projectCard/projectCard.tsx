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
import { apiHelperService } from "@/services/project";

interface DehixProjectInfo {
  projectName: string;
  description: string;
  companyId: string;
  email: string;
  companyName: string;
  skillsRequired: string[];
  role: string;
  projectType: string;
  status: string;
  team: string[];
  url: { value: string; _id: string }[];
  createdAt: string;
  updatedAt: string;
}

type ProjectCardProps = React.ComponentProps<typeof Card> & {
  id: string;
};

export function ProjectCard({ id, ...props }: ProjectCardProps) {
  const [projectInfo, setProjectInfo] = useState<DehixProjectInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return; // Avoid fetching if id is empty

    const fetchProjectData = async () => {
      try {
        const response = await apiHelperService.getAllBusinessProject(id);
        //console.log("API Response:", response.data);
        if (response?.data?.data?.data) {
          setProjectInfo(response.data.data.data);
        } else {
          console.error("Project info data is missing or null");
          // You can also set a fallback value if needed
          setProjectInfo(null); // or any default value
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  if (loading) {
    return <p>Loading project data...</p>;
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
          <span className="inline-block px-3 py-1 border rounded-md bg-green-100 border-green-300 text-sm font-semibold text-gray-600 ml-2">
            {projectInfo.status}
          </span>
        </div>

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

        <div className="flex items-center">
          <Users className="w-5 h-5 text-gray-500 mr-2" />
          <p className="text-md font-semibold">Team: </p>
          <p className=" ml-2">{projectInfo.team.join(", ")}</p>
        </div>

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
                  {urlItem._id} - {urlItem.value}
                </a>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Created At and Updated At */}
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
