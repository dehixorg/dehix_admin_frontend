import React, { useState, useEffect } from "react";
import { PackageOpen, Eye, Trash2 } from "lucide-react";

import AddDomain from "@/components/Domain/addDomain";
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
} from "@/components/ui/dialog";
import { axiosInstance } from "@/lib/axiosinstance";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface DomainData {
  _id: string;
  label: string;
  description: string;
  createdAt?: string; // ISO date string
  createdBy?: string;
  status?: string; // User or system that created the domain
}

const DomainTable: React.FC = () => {
  const [domainData, setDomainData] = useState<DomainData[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false); // State to handle no data available

  // Function to fetch domain data
  const fetchDomainData = async () => {
    setLoading(true);
    setNoData(false); // Reset noData state before fetching
    try {
      const response = await axiosInstance.get("/domain/all");
      if (response.data.data.length === 0) {
        setNoData(true); // Set noData if response is empty
      } else {
        setDomainData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching domain data:", error);
      setNoData(true); // Handle errors by showing no data
    } finally {
      setLoading(false);
    }
  };

  // Fetch domain data on component mount
  useEffect(() => {
    fetchDomainData();
  }, []);

  // Handle domain deletion
  const handleDelete = async (domainId: string) => {
    if (!domainId) {
      console.error("Domain ID is undefined.");
      return;
    }
    try {
      await axiosInstance.delete(`/domain/${domainId}`);
      fetchDomainData(); // Re-fetch data after deletion
    } catch (error: any) {
      console.error(
        "Error deleting domain:",
        error.response?.data || error.message,
      );
    }
  };

  const handleSwitchChange = (labelId: string, checked: boolean) => {
    setDomainData((prevData) =>
      prevData.map((user) =>
        user._id === labelId
          ? { ...user, status: checked ? "active" : "inactive" }
          : user,
      ),
    );
  };
  // Callback to re-fetch domain data after adding a new domain
  const handleAddDomain = async () => {
    try {
      // Optionally post newDomain if needed
      await fetchDomainData(); // Fetch updated data after adding the domain
    } catch (error) {
      console.error("Error adding domain:", error);
    }
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <AddDomain onAddDomain={handleAddDomain} />{" "}
            {/* Pass the callback */}
          </div>
        </div>
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Domain Name</TableHead>
                  <TableHead className="w-[180px]">Created At</TableHead>
                  <TableHead className="w-[180px]">Created By</TableHead>
                  <TableHead className="w-[180px]">Switch</TableHead>
                  <TableHead className="w-[180px]">Details</TableHead>
                  <TableHead className="w-[180px]">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : noData ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
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
                ) : domainData.length > 0 ? (
                  domainData.map((domain) => (
                    <TableRow key={domain._id}>
                      <TableCell>{domain.label}</TableCell>
                      <TableCell>
                        {domain.createdAt || "No Data Available"}
                      </TableCell>
                      <TableCell>
                        {domain.createdBy || "No Data Available"}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={domain.status === "active"}
                          onCheckedChange={(checked) =>
                            handleSwitchChange(domain._id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="p-4">
                            <DialogHeader>
                              <DialogTitle>Domain Details</DialogTitle>
                            </DialogHeader>
                            <div>
                              <p>
                                <strong>Name:</strong> {domain.label}
                              </p>
                              <p>
                                <strong>Description:</strong>{" "}
                                {domain.description
                                  ? domain.description
                                  : "No description available"}
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
                    <TableCell colSpan={6} className="text-center">
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
