"use client";
import { PackageOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";


function Appliedcandidates({
  AppliedCandidateData,
}: {
  AppliedCandidateData: string[] |null ;
}) {
  const appliedCandidates = AppliedCandidateData;

  if (!appliedCandidates) {
    return (
      <div className="text-center py-10">
        <PackageOpen className="mx-auto text-gray-500" size={100} />
        <p className="text-gray-500">No Candidates found.</p>
      </div>
    );
  }

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
            {
              appliedCandidates.map((candidate, index) => (
                <TableRow key={index} className="border-b border-gray-700">
                  {" "}
                  {/* Add border styling */}
                  <TableCell className="py-2">{index + 1}</TableCell>{" "}
                  {/* Serial number */}
                  <TableCell className="py-2">{candidate}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default Appliedcandidates;
