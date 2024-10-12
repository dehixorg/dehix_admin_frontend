import React, { useState, useEffect } from "react";
import { PackageOpen, Trash2 } from "lucide-react";

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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { axiosInstance } from "@/lib/axiosinstance";
import { ButtonIcon } from "@/components/ui/eyeButton";
import { Switch } from "@/components/ui/switch";
import { Messages, statusType } from "@/utils/common/enum";
import { apiHelperService } from "@/services/domain";

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
      const response = await apiHelperService.getAllDomainadmin();
      if (!response.data.data) {
        setNoData(true); // Set noData if response is empty
      } else {
        setDomainData(response.data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.FETCH_ERROR("domain"),
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
    try {
      await apiHelperService.deleteDomain(domainId);
      fetchDomainData(); // Re-fetch data after deletion
    } catch (error: any) {
      toast({
        title: "Error",
        description: Messages.DELETE_ERROR("domain"),
        variant: "destructive", // Red error message
      });
    }
  };

  const handleSwitchChange = async (
    labelId: string,
    checked: boolean,
    index: number,
  ) => {
    // Initialize toast

    try {
      setDomainData((prevDomainData) => {
        // Create a shallow copy of the existing array
        const updatedDomainData = [...prevDomainData];

        updatedDomainData[index].status = checked
          ? statusType.active
          : statusType.inactive;

        // Return the updated array
        return updatedDomainData;
      });
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
      setDomainData((prevDomainData) => {
        // Create a shallow copy of the existing array
        const updatedDomainData = [...prevDomainData];

        updatedDomainData[index].status = checked
          ? statusType.inactive
          : statusType.active;

        // Return the updated array
        return updatedDomainData;
      });
      toast({
        title: "Error",
        description: "Failed to update domain status. Please try again.",
        variant: "destructive", // Red error message
      });
    }
  };
  const formatID = (id: string) => {
    if (id.length <= 7) return id;
    return `${id.substring(0, 5)}...${id.substring(id.length - 2)}`;
  };
  // Callback to re-fetch domain data after adding a new domain

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <AddDomain onAddDomain={fetchDomainData} domainData={domainData} />{" "}
            {/* Pass the callback */}
          </div>
        </div>
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Domain Id</TableHead>
                  <TableHead className="w-[180px]">Domain Name</TableHead>
                  <TableHead className="w-[300px]">Created At</TableHead>
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
                ) : domainData ? (
                  domainData.map((domain, index) => (
                    <TableRow key={domain._id}>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <span>
                              {formatID(domain._id || "") ||
                                "No Data Available"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {domain._id ? domain._id : "No Data Available"}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{domain.label}</TableCell>
                      <TableCell>
                        {domain.createdAt || "No Data Available"}
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <span>
                              {formatID(domain.createdBy || "") ||
                                "No Data Available"}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {domain.createdBy
                              ? domain.createdBy
                              : "No Data Available"}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={domain.status === statusType.active}
                          onCheckedChange={(checked) =>
                            handleSwitchChange(domain._id, checked, index)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <ButtonIcon></ButtonIcon>
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
