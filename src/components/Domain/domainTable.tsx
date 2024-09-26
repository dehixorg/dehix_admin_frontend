import React, { useState, useEffect } from "react";
import { PackageOpen, Eye, Trash2 } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
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
import { statusType } from "@/utils/common/enum";

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
  const { toast } = useToast();
  // Function to fetch domain data
  const fetchDomainData = async () => {
    setLoading(true);
    setNoData(false); // Reset noData state before fetching
    try {
      const response = await axiosInstance.get("/domain/all");
      if (!response.data.data) {
        setNoData(true); // Set noData if response is empty
      } else {
        setDomainData(response.data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch domain data. Please Refresh the page.",
        variant: "destructive", // Red error message
      });

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
      toast({
        title: "Error",
        description: "Failed there is no such id . Please try again.",
        variant: "destructive", // Red error message
      });
      return;
    }
    try {
      await axiosInstance.delete(`/domain/${domainId}`);
      fetchDomainData(); // Re-fetch data after deletion
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete domain . Please try again.",
        variant: "destructive", // Red error message
      });
    }
  };

  const handleSwitchChange = async (labelId: string, checked: boolean) => {
    // Initialize toast
    setDomainData((prevData) =>
      prevData.map((user) =>
        user._id === labelId
          ? { ...user, status: checked ? statusType.active : statusType.inactive }
          : user,
      ),
    );
    try {
      await axiosInstance.put(`/domain/${labelId}`, {
        status: checked ? statusType.active : statusType.inactive,
      });
      toast({
        title: "Success",
        description: `Domain status updated to ${checked ? statusType.active : statusType.inactive}`,
        variant: "default",
      });
    } catch (error) {
      // Revert the status change if the API call fails
      setDomainData((prevData) =>
        prevData.map((domain) =>
          domain._id === labelId
            ? { ...domain, status: checked ?statusType.inactive : statusType.active } // revert back to original status
            : domain,
        ),
      );
      toast({
        title: "Error",
        description: "Failed to update domain status. Please try again.",
        variant: "destructive", // Red error message
      });
    }
  };
  // Callback to re-fetch domain data after adding a new domain
  const handleAddDomain = async () => {
    try {
      // Optionally post newDomain if needed
      await fetchDomainData(); // Fetch updated data after adding the domain
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add domain . Please try again.",
        variant: "destructive", // Red error message
      });
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
                  <TableHead className="w-[180px]">Status</TableHead>
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
                          checked={domain.status === statusType.active}
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
