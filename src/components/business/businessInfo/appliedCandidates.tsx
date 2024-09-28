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

function Appliedcandidates({ id }: { id: string }) {
  const [appliedCandidates, setAppliedCandidates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  //const id = "qMeeaiiiEuU2eSuzbuRmJSAwcCA2"; // Replace with the appropriate ID

  useEffect(() => {
    const fetchAppliedCandidates = async () => {
      try {
        const response = await apiHelperService.getAllBusinessPersonalInfo(id);
        const data = response.data;
        setAppliedCandidates(data.Appliedcandidates || []);
      } catch (error) {
        setError((error as Error).message);
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedCandidates();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (appliedCandidates.length === 0) {
    return <p>No applied candidates found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Applied Candidates List</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serial No.</TableHead>
            <TableHead>Candidate Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appliedCandidates.map((candidate, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell> {/* Serial number */}
              <TableCell>{candidate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Appliedcandidates;
