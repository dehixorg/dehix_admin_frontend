import React, { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";

import { DeleteButtonIcon } from "../ui/deleteButton";
import { useToast } from "@/components/ui/use-toast";
import AddDomain from "@/components/Domain/addDomain";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ButtonIcon } from "@/components/ui/arrowButton";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Messages, statusType } from "@/utils/common/enum";
import { Messages, statusType, formatID } from "@/utils/common/enum";
import { apiHelperService } from "@/services/domain";
import { formatTime } from "@/lib/utils";
import CopyButton from "@/components/copybutton";

interface DomainData {
  _id: string;
  label: string;
  description: string;
  createdAt?: string;
  createdBy?: string;
  status?: string;
}

const DomainTable: React.FC = () => {
  const [domainData, setDomainData] = useState<DomainData[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const { toast } = useToast();


  // Function to fetch domain data
  const fetchDomainData = async () => {
    setLoading(true);
    setNoData(false);
    try {
      const response = await apiHelperService.getAllDomainAdmin();
      if (!response.data.data) {
        setNoData(true);
      } else {
        setDomainData(response.data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.FETCH_ERROR("domain"),
        variant: "destructive",
      });
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomainData();
  }, []);

  const handleDelete = async (domainId: string) => {
    try {
      await apiHelperService.deleteDomain(domainId);
      fetchDomainData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: Messages.DELETE_ERROR("domain"),
        variant: "destructive",
      });
    }
  };

  const handleSwitchChange = async (
    labelId: string,
    checked: boolean,
    index: number,
  ) => {
    try {
      setDomainData((prevDomainData) => {
        const updatedDomainData = [...prevDomainData];
        updatedDomainData[index].status = checked
          ? statusType.active
          : statusType.inactive;
        return updatedDomainData;
      });
      await apiHelperService.updateDomainStatus(labelId, checked ? statusType.active : statusType.inactive);
      toast({
        title: "Success",
        description: `Domain status updated to ${checked ? statusType.active : statusType.inactive}`,
        variant: "default",
      });
    } catch (error) {
      setDomainData((prevDomainData) => {
        const updatedDomainData = [...prevDomainData];
        updatedDomainData[index].status = checked
          ? statusType.inactive
          : statusType.active;
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
            <AddDomain onAddDomain={fetchDomainData} domainData={domainData} />
            <AddDomain onAddDomain={fetchDomainData} domainData={domainData} />
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
                  // Skeleton Loader during data loading
                  <>
                    {[...Array(9)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-28" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-36" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-28" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-7 w-12 rounded-3xl" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-10" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : noData ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen className="mx-auto text-gray-500" size="100" />
                        <p className="text-gray-500">
                          No data available.
                          <br /> This feature will be available soon.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : domainData.length > 0 ? (
                ) : domainData.length > 0 ? (
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
                        {formatTime(domain.createdAt) || "No Data Available"}
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
                          onCheckedChange={(checked) => handleSwitchChange(domain._id, checked, index)}
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteButtonIcon onClick={() => handleDelete(domain._id)} />
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <ButtonIcon />
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
                                {domain.description ||
                                  "No description available"}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen className="mx-auto text-gray-500" size="100" />
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
