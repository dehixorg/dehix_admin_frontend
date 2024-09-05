"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen, Eye, Trash2 } from "lucide-react";

import AddDomain from "./addDomain";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/lib/axiosinstance";
import { Button } from "@/components/ui/button";

interface DomainData {
  _id: string;
  domainName: string;
  description: string;
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const DomainTable: React.FC = () => {
  const [domainData, setDomainData] = useState<DomainData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomainData = async () => {
      try {
        const response = await axiosInstance.get("/domains/all");
        console.log("API Response:", response.data);
        setDomainData(response.data.data);
      } catch (error) {
        console.error("Error fetching domain data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDomainData();
  }, []);

  const handleDelete = async (domainId: string) => {
    console.log("Domain ID received in handleDelete:", domainId); // Debugging line
    if (!domainId) {
      console.error("Domain ID is undefined.");
      return;
    }
    try {
      await axiosInstance.delete(`/domains/${domainId}`);
      setDomainData((prevData) =>
        prevData.filter((domain) => domain._id !== domainId),
      );
    } catch (error: any) {
      console.error(
        "Error deleting domain:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <AddDomain />
          </div>
        </div>
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : domainData.length > 0 ? (
                  domainData.map((domain) => (
                    <TableRow key={domain._id}>
                      <TableCell>{domain.domainName}</TableCell>
                      <TableCell>
                        {truncateText(domain.description, 50)}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Eye className="w-4 h-4" />{" "}
                              {/* Icon for the button */}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="p-4">
                            <DialogHeader>
                              <DialogTitle>Domain Details</DialogTitle>
                            </DialogHeader>
                            <div>
                              <p>
                                <strong>Name:</strong> {domain.domainName}
                              </p>
                              <p>
                                <strong>Description:</strong>{" "}
                                {domain.description}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <Trash2
                          className="cursor-pointer text-gray-500 hover:text-red-500"
                          onClick={() => handleDelete(domain._id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen
                          className="mx-auto text-gray-500"
                          size="100"
                        />
                        <p className="text-gray-500">
                          No data available.
                          <br /> This feature will be available soon.
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

export default DomainTable;
