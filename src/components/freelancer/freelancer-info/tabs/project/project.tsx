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
import { apiHelperService } from "@/services/freelancer";
import { useToast } from "@/components/ui/use-toast";
import { Messages, statusType } from "@/utils/common/enum";

interface RejectedProject {
  _id: string;
}

interface AcceptedProject {
  _id: string;
}

interface PendingProject {
  _id: string;
}

interface UserData {
  pendingProject: PendingProject[];
  rejectedProject: RejectedProject[];
  acceptedProject: AcceptedProject[];
}

interface ProjectProps {
  id: string; // Added id prop
}

const Project: React.FC<ProjectProps> = ({ id }) => {
  // Use id prop
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response =
          await apiHelperService.getAllFreelancerPersonalInfo(id);
        const { pendingProject, rejectedProject, acceptedProject } =
          response.data;

        setUserData({ pendingProject, rejectedProject, acceptedProject });
      } catch (error) {
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("project"),
          variant: "destructive", // Red error message
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]); // Depend on id

  return (
    <div className="px-">
      <div className="mb-8 mt-4">
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : userData ? (
                  <>
                    {userData.pendingProject.map((pending) => (
                      <TableRow key={pending._id}>
                        <TableCell>Skill</TableCell>
                        <TableCell>{pending._id}</TableCell>
                        <TableCell>Pending</TableCell>
                      </TableRow>
                    ))}
                    {userData.rejectedProject.map((rejected) => (
                      <TableRow key={rejected._id}>
                        <TableCell>Domain</TableCell>
                        <TableCell>{rejected._id}</TableCell>
                        <TableCell>Rejected</TableCell>
                      </TableRow>
                    ))}
                    {userData.acceptedProject.map((accepted) => (
                      <TableRow key={accepted._id}>
                        <TableCell>{accepted._id}</TableCell>
                        <TableCell>Accepted</TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
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

export default Project;
