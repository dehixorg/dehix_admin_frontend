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
import { apiHelperService } from "@/services/example";

interface Project {
  name: string;
  description: string;
  status: string;
}

function ProjectList({ id }: { id: string }) {
  const [projectid, setProjects] = useState<string[]>([]);
  const [project, setProject] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  //const id = "8LdE4z5D38P3pL16XDpt8THhHiw1";
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiHelperService.getAllBusinessPersonalInfo(id);
        const data = response.data; // Ensure the data format is correct
        setProjects(data.ProjectList || []); // Adjust based on your API response structure
      } catch (error) {
        setError((error as Error).message);
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [id]);
  console.log(projectid);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectdata: Project[] = [];
        for (const projectId of projectid) {
          const response =
            await apiHelperService.getAllBusinessProject(projectId);
          console.log(response.data);
          const data = response.data.data;
          const info: Project = {
            name: data.projectName,
            description: data.description,
            status: data.status,
          };
          projectdata.push(info);
        } // Ensure the data format is correct
        setProject(projectdata || []); // Adjust based on your API response structure
      } catch (error) {
        setError((error as Error).message);
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [projectid]);
  console.log(project);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (projectid.length === 0) {
    return <p>No projects found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Project List</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serial No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {project.map((project1, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell> {/* Serial number */}
              <TableCell>{project1.name}</TableCell>
              <TableCell>{project1.description}</TableCell>
              <TableCell>{project1.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProjectList;
