"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { Filter, PackageOpen } from "lucide-react";
import { useRouter } from "next/navigation"; // For navigation

import { useToast } from "@/components/ui/use-toast";
import { Messages , AccountOption } from "@/utils/common/enum";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
// import { ButtonIcon } from "@/components/ui/arrowButton";
import { InfoButton } from "@/components/ui/InfoButton";
import { apiHelperService } from "@/services/business";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import { FilterTable } from "@/components/filter/filtertable/FilterTable";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import ConfirmationDialog from "@/components/confirmationDialog";
interface SkillDomainData {
  _id: string;
  name: string;
  level: string;
  experience: string;
  interviewStatus: string;
  interviewInfo: string;
  interviewerRating: number;
}

interface UserData {
  _id: string; // Assuming your API returns this field for each business
  firstName: string;
  email: string;
  phone: string;
  skills?: SkillDomainData[];
  domains?: SkillDomainData[];
  status: string;
}

const BusinessTable: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [selectedIndex,setSelectedIndex] = useState(-1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiHelperService.getAllBusiness();
        setUserData(response.data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("business"),
          variant: "destructive", // Red error message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  const handleStatusChange = (newStatus: string,index :number) => {
    setSelectedStatus(newStatus);
    setSelectedIndex(index);
    setDialogOpen(true);
    
  };
  const handleStatusUpdate  = async () =>{
    if (selectedIndex === -1) {
      toast({
        title: "Error",
        description: "No user selected for status update.",
        variant: "destructive",
      });
      return;
    }
  
    const status = userData[selectedIndex].status;
    try {
      setUserData((prevUserData) => {
        const updatedUserData = [...prevUserData];
        updatedUserData[selectedIndex].status = selectedStatus;
        return updatedUserData;
      });
      await apiHelperService.updateUserStatus(userData[selectedIndex]._id, selectedStatus);
      toast({
        title: "Success",
        description: `User status updated to ${selectedStatus}`,
        variant: "default",
      });
    } catch (error) {
      setUserData((prevUserData) => {
        const updatedUserData = [...prevUserData];
        updatedUserData[selectedIndex].status =status;
        return updatedUserData;
      });
      toast({
        title: "Error",
        description: "Failed to update User status. Please try again.",
        variant: "destructive",
      });
    }
    finally {
      setDialogOpen(false);
      setSelectedIndex(-1);
    }
  };




  // Handle button click to navigate to tabs page with the business ID
  const handleViewBusiness = (id: string) => {
    router.push(`/business/tabs?id=${id}`); // Pass the ID as a query parameter
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-2">
        {/* Title Section */}
        <div className="mb-4 mt-4 mr-4">
          <h2 className="table-title">Business Table</h2>
        </div>

        <FilterTable />

        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email ID</TableHead>
                  <TableHead>Phone No.</TableHead>
                  <TableHead className="text-center">Skills</TableHead>
                  <TableHead className="text-center">Domains</TableHead>
                  <TableHead className="text-center">Account Status</TableHead>
                  <TableHead className="w-[20px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Use Skeletons while loading
                  <>
                    {[...Array(9)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-14" />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-start items-start">
                            <Skeleton className="h-5 w-40" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-28 justify-items-start" />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center items-center">
                            <Skeleton className="h-5 w-10" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center items-center">
                            <Skeleton className="h-5 w-10" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-6 justify-items-center" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : userData && userData.length > 0 ? (
                  userData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell className="text-center">
                        {user.skills ? (
                          <Tooltip>
                            <TooltipTrigger>
                              <span>
                                {user.skills[0]?.name}
                                {user.skills.length > 1
                                  ? `+${user.skills.length - 1} more`
                                  : ""}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[500px] max-h-[250px] whitespace-normal break-words">
                              {user.skills
                                .map((skill) => skill.name)
                                .join(", ")}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          "0"
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {user.domains ? (
                          <Tooltip>
                            <TooltipTrigger>
                              <span>
                                {user.domains[0]?.name}
                                {user.domains.length > 1
                                  ? `+${user.domains.length - 1} more`
                                  : ""}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[500px] max-h-[250px] whitespace-normal break-words">
                              {user.domains
                                .map((domain) => domain.name)
                                .join(", ")}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          "0"
                        )}
                      </TableCell>
                      <TableCell>
                        <InfoButton
                          onClick={() => handleViewBusiness(user._id)}
                        ></InfoButton>
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
                          No data available. <br />
                          This feature will be available soon. <br />
                          Here you can get directly hired for different roles.
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
      <ConfirmationDialog
        isOpen={dialogOpen}
        onConfirm={handleStatusUpdate}
        onCancel={() => setDialogOpen(false)}
        title="Confirm Updation"
        description={`Are you sure you want to change the account status to "${selectedStatus}"`}
        confirmButtonName="Confirm"
        cancelButtonName="Cancel"

      />
    </div>
  );
};

export default BusinessTable;
