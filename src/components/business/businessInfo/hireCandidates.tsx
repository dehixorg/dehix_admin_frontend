"use client";

import { useEffect, useState } from "react";

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

interface HireFreelancer {
  freelancer: string;
  status: string;
  _id: string;
}

function Hirefreelancer({ id }: { id: string }) {
  const [hireFreelancers, setHireFreelancers] = useState<HireFreelancer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast(); // For displaying toast notifications

  useEffect(() => {
    const fetchHireFreelancers = async () => {
      try {
        const response = await apiHelperService.getAllBusinessPersonalInfo(id);
        const data = response.data;
        setHireFreelancers(data.hirefreelancer || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch freelancers. Please try again.",
          variant: "destructive",
        });
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHireFreelancers();
  }, [id]);

  return (
    <Card className="w-full max-w p-4">
      <CardHeader>
        <CardTitle> Hired FreeLancer</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full text-white bg-black  ">
          {" "}
          {/* Full width table with black background */}
          <TableHeader>
            <TableRow>
              <TableHead>Serial No.</TableHead> {/* Match header styles */}
              <TableHead>Freelancer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-white text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : hireFreelancers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-white text-center">
                  No freelancers found.
                </TableCell>
              </TableRow>
            ) : (
              hireFreelancers.map((hireFreelancer, index) => (
                <TableRow
                  key={hireFreelancer._id}
                  className="border-b border-gray-700"
                >
                  {" "}
                  {/* Add border styling */}
                  <TableCell className="py-2">{index + 1}</TableCell>{" "}
                  {/* Serial number */}
                  <TableCell className="py-2">
                    {hireFreelancer.freelancer}
                  </TableCell>
                  <TableCell className="py-2">
                    <span
                      className={
                        hireFreelancer.status === "Accepted"
                          ? "text-green-500"
                          : hireFreelancer.status === "Rejected"
                            ? "text-red-500"
                            : hireFreelancer.status === "Pending"
                              ? "text-yellow-500"
                              : ""
                      }
                    >
                      {hireFreelancer.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-2">{hireFreelancer._id}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default Hirefreelancer;
