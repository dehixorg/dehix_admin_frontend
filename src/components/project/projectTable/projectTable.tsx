"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { apiHelperService } from "@/services/project";
import { ButtonIcon } from "@/components/ui/arrowButton";

interface Project {
  _id: string;
  projectName: string;
  description: string;
  companyId: string;
  email: string;
  companyName: string;
  end: string | null;
  skillsRequired: string[];
  role: string;
  projectType: string;
  profiles: Profile[];
  status: string;
  team: string[];
  url: string[];
  createdAt: string;
  updatedAt: string;
}

interface Profile {
  domain: string;
  freelancersRequired: string;
  skills: string[];
  minConnect: number;
  description: string;
  _id: string;
}

const ProjectTable: React.FC = () => {
  const [userData, setUserData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiHelperService.getAllProject();
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleRedirect = (id: string) => {
    router.push(`/project/tabs?id=${id}`);
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Render Skeletons when loading
                  <>
                    {Array.from({ length: 9 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-5 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-12 " />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : userData?.length > 0 ? (
                  userData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.projectName}</TableCell>
                      <TableCell>{user.companyName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell className="flex justify-end">
                        <ButtonIcon
                          onClick={() => handleRedirect(user._id)}
                        ></ButtonIcon>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen
                          className="mx-auto text-gray-500"
                          size="100"
                        />
                        <p className="text-gray-500">
                          No data available.
                          <br /> This feature will be available soon.
                          <br />
                          Here you can get directly hired for different roles.
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

export default ProjectTable;
