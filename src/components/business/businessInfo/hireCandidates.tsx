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

import CopyButton from "@/components/copybutton";
import { Badge } from "@/components/ui/badge";

interface HireFreelancerInfo {
  freelancer: string;
  status: string;
  _id: string;
}

function Hirefreelancer({
  hirefreelancerData,
}: {
  hirefreelancerData: HireFreelancerInfo[] |null ;
}) {
  const hireFreelancers = hirefreelancerData;

  if (!hireFreelancers) {
    return (
      <div className="text-center py-10">
        <PackageOpen className="mx-auto text-gray-500" size={100} />
        <p className="text-gray-500">No freelancers found.</p>
      </div>
    );
  }
  const getStatusBadge = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-500 hover:bg-green-600" ;
        case "rejected":
          return "bg-red-500 hover:bg-red-600" ;
          case "pending":
            return   "bg-yellow-500 hover:bg-yellow-600" ;
      default:
        return  "bg-gray-500 hover:bg-gray-600" ;
    }
  };
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
            { 
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
                    <Badge
                      className={
                        getStatusBadge(hireFreelancer.status)
                      }
                    >
                      {hireFreelancer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center space-x-2">
                      {hireFreelancer._id}
                      <CopyButton id={hireFreelancer._id}></CopyButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default Hirefreelancer;
