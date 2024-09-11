"use client";

import { useEffect, useState } from "react";

import { axiosInstance } from "@/lib/axiosinstance";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface HireFreelancer {
  freelancer: string;
  status: string;
  _id: string;
}

function Hirefreelancer({ id }: { id: string }) {
  const [hireFreelancers, setHireFreelancers] = useState<HireFreelancer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  //const id = "qMeeaiiiEuU2eSuzbuRmJSAwcCA2"; // Replace with the appropriate ID

  useEffect(() => {
    const fetchHireFreelancers = async () => {
      try {
        const response = await axiosInstance.get(`/business/${id}`);
        const data = response.data;
        setHireFreelancers(data.hirefreelancer || []);
      } catch (error) {
        setError((error as Error).message);
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHireFreelancers();
  }, [id]);
  console.log(hireFreelancers);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (hireFreelancers.length === 0) {
    return <p>No freelancers found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Hire Freelancer List</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serial No.</TableHead>
            <TableHead>Freelancer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hireFreelancers.map((hireFreelancer, index) => (
            <TableRow key={hireFreelancer._id}>
              <TableCell>{index + 1}</TableCell> {/* Serial number */}
              <TableCell>{hireFreelancer.freelancer}</TableCell>
              <TableCell>{hireFreelancer.status}</TableCell>
              <TableCell>{hireFreelancer._id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Hirefreelancer;
