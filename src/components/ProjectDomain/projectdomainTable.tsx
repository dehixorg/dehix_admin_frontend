import React, { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
import { DeleteButtonIcon } from "../ui/deleteButton";
import { Messages, statusType, formatID } from "@/utils/common/enum";
import { useToast } from "@/components/ui/use-toast";
import AddProjectDomain from "@/components/ProjectDomain/addProjectDomain";
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
import { ButtonIcon } from "@/components/ui/arrowButton";
import { Switch } from "@/components/ui/switch";
import { apiHelperService } from "@/services/projectdomain";
import CopyButton from "@/components/copybutton";
import ProjectDomainTableSkeleton from "@/utils/common/ProjectDomainTableSkeleton"; // Import the new skeleton component

interface DomainData {
  _id: string;
  label: string;
  description: string;
  createdAt?: string; // ISO date string
  createdBy?: string;
  status?: string; // User or system that created the domain
}

const ProjectDomainTable: React.FC = () => {
  const [domainData, setDomainData] = useState<DomainData[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false); // State to handle no data available
  const { toast } = useToast();

  // Function to fetch domain data
  const fetchDomainData = async () => {
    setLoading(true);
    setNoData(false); // Reset noData state before fetching
    try {
      const response = await apiHelperService.getAllProjectdomain();
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
      await apiHelperService.deleteProjectdomain(domainId);
      fetchDomainData();
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
    setDomainData((prevDomainData) => {
      // Create a shallow copy of the existing array
      const updatedDomainData = [...prevDomainData];

      updatedDomainData[index].status = checked
        ? statusType.active
        : statusType.inactive;

      // Return the updated array
      return updatedDomainData;
    });
    try {
      await axiosInstance.put(`/domain/${labelId}`, {
        status: checked ? statusType.active : statusType.inactive,
      });
      toast({
        title: "Success",
        description: `Domain status updated to ${
          checked ? statusType.active : statusType.inactive
        }`,
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
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <AddProjectDomain
              onAddProjectDomain={fetchDomainData}
              domainData={domainData}
            />{" "}
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
                  <TableHead className="w-[20px]">Delete</TableHead>
                  <TableHead className="w-[20px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <ProjectDomainTableSkeleton /> // Use the new skeleton component
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
                ) : (
                  domainData.map((domain, index) => (
                    <TableRow key={domain._id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Tooltip>
                            <TooltipTrigger>
                              <span>{formatID(domain._id)}</span>
                            </TooltipTrigger>

                            <CopyButton id={domain._id} />

                            <TooltipContent>
                              {domain._id || "No Data Available"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>

                      <TableCell>{domain.label}</TableCell>
                      <TableCell>
                        {domain.createdAt || "No Data Available"}
                      </TableCell>
                      <TableCell>
                        {domain.createdBy ? (
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger>
                                <span>{formatID(domain.createdBy || "")}</span>
                              </TooltipTrigger>

                              <CopyButton id={domain.createdBy || ""} />

                              <TooltipContent>
                                {domain.createdBy || "No Data Available"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          "No Data Available"
                        )}
                      </TableCell>

                      <TableCell>
                        <Switch
                          checked={domain.status === statusType.active}
                          onCheckedChange={(checked) =>
                            handleSwitchChange(domain._id, checked, index)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <DeleteButtonIcon
                          onClick={() => handleDelete(domain._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <ButtonIcon />
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDomainTable;
