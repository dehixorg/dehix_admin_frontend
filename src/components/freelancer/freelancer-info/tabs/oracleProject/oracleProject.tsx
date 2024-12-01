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

interface OracleProjectProps {
  id: string; // Added id prop
}

interface OracleProject {
  _id: string;
  verifier_id: string;
  verifier_username: string; // Added verifier_username field
  requester_id: string;
  document_id: string;
  doc_type: string; // Added doc_type field
  verification_status: "Pending" | "Approved" | "Denied";
}

interface UserData {
  oracleProject: OracleProject[];
}

const OracleProject: React.FC<OracleProjectProps> = ({ id }) => {
  // Use id prop
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response =
          await apiHelperService.getAllFreelancerPersonalInfo(id);
        const { oracleProject } = response.data;
        setUserData({ oracleProject });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]); // Depend on id

  return (
    <div className="">
      <div className="mb-8 mt-4">
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Verifier-Id</TableHead>
                  <TableHead>Verifier-Username</TableHead>
                  <TableHead>Requester-Id</TableHead>
                  <TableHead>Document-Id</TableHead>
                  <TableHead>Document-Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : userData ? (
                  <>
                    {userData.oracleProject.map((oracle) => (
                      <TableRow key={oracle._id}>
                        <TableCell>{oracle._id}</TableCell>
                        <TableCell>{oracle.verifier_id}</TableCell>
                        <TableCell>{oracle.verifier_username}</TableCell>
                        <TableCell>{oracle.requester_id}</TableCell>
                        <TableCell>{oracle.document_id}</TableCell>
                        <TableCell>{oracle.doc_type}</TableCell>
                        <TableCell>{oracle.verification_status}</TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
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

export default OracleProject;
