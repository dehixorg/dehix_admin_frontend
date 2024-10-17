"use client";

import { useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { Messages, statusType } from "@/utils/common/enum";
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

function Appliedcandidates({ id }: { id: string }) {
  const [appliedCandidates, setAppliedCandidates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    const fetchAppliedCandidates = async () => {
      try {
        const response = await apiHelperService.getAllBusinessPersonalInfo(id);
        const data = response.data;
        setAppliedCandidates(data.Appliedcandidates || []);
      } catch (error) {
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("business"),
          variant: "destructive", // Red error message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedCandidates();
  }, [id]);

  return (
    <Card className=" p-4">
      {" "}
      {/* Set a max width and full width */}
      <CardHeader>
        <CardTitle>Applied Candidates List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full text-white bg-black">
          {" "}
          {/* Full width table with black background */}
          <TableHeader>
            <TableRow>
              <TableHead>Serial No.</TableHead>
              <TableHead>Candidate Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-white text-center">
                  Loading...
                </TableCell>{" "}
                {/* Center loading message */}
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={2} className="text-white text-center">
                  Error: {error}
                </TableCell>{" "}
                {/* Center error message */}
              </TableRow>
            ) : appliedCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-white text-center">
                  No applied candidates found.
                </TableCell>{" "}
                {/* Center no data message */}
              </TableRow>
            ) : (
              appliedCandidates.map((candidate, index) => (
                <TableRow key={index} className="border-b border-gray-700">
                  {" "}
                  {/* Add border styling */}
                  <TableCell className="py-2">{index + 1}</TableCell>{" "}
                  {/* Serial number */}
                  <TableCell className="py-2">{candidate}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default Appliedcandidates;
