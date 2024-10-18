import React, { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";

import { ButtonIcon } from "../ui/arrowButton";
import { DeleteButtonIcon } from "../ui/deleteButton";

import { useToast } from "@/components/ui/use-toast";
import AddSkill from "@/components/skill/addskill";
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
import { Switch } from "@/components/ui/switch";
import { Messages, statusType } from "@/utils/common/enum";
import { apiHelperService } from "@/services/skill";
import CopyButton from "@/components/copybutton";

interface SkillData {
  _id: string;
  label: string;
  description: string;
  createdAt?: string; // ISO date string
  createdBy?: string;
  status?: string; // User or system that created the Skill
}

const SkillTable: React.FC = () => {
  const [SkillData, setSkillData] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false); // State to handle no data available
  const { toast } = useToast();
  // Function to fetch Skill data
  const fetchSkillData = async () => {
    setLoading(true);
    setNoData(false); // Reset noData state before fetching
    try {
      const response = await apiHelperService.getAllSkillAdmin();
      if (!response.data.data) {
        setNoData(true); // Set noData if response is empty
      } else {
        setSkillData(response.data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.FETCH_ERROR("skill"),
        variant: "destructive", // Red error message
      });

      setNoData(true); // Handle errors by showing no data
    } finally {
      setLoading(false);
    }
  };

  // Fetch Skill data on component mount
  useEffect(() => {
    fetchSkillData();
  }, []);

  // Handle Skill deletion
  const handleDelete = async (SkillId: string) => {
    try {
      await apiHelperService.deleteSkill(SkillId);
      fetchSkillData(); // Re-fetch data after deletion
    } catch (error: any) {
      toast({
        title: "Error",
        description: Messages.DELETE_ERROR("skill"),
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
      setSkillData((prevSkillData) => {
        // Create a shallow copy of the existing array
        const updatedSkillData = [...prevSkillData];

        updatedSkillData[index].status = checked
          ? statusType.active
          : statusType.inactive;

        // Return the updated array
        return updatedSkillData;
      });
      await apiHelperService.updateSkillStatus(
        labelId,
        checked ? statusType.active : statusType.inactive,
      );
      toast({
        title: "Success",
        description: `Skill status updated to ${checked ? statusType.active : statusType.inactive}`,
        variant: "default",
      });
    } catch (error) {
      // Revert the status change if the API call fails
      setSkillData((prevSkillData) => {
        // Create a shallow copy of the existing array
        const updatedSkillData = [...prevSkillData];

        updatedSkillData[index].status = checked
          ? statusType.inactive
          : statusType.active;

        // Return the updated array
        return updatedSkillData;
      });
      toast({
        title: "Error",
        description: "Failed to update skill status. Please try again.",
        variant: "destructive", // Red error message
      });
    }
  };
  const formatID = (id: string) => {
    if (id.length <= 7) return id;
    return `${id.substring(0, 5)}...${id.substring(id.length - 2)}`;
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <AddSkill onAddSkill={fetchSkillData} skillData={SkillData} />{" "}
            {/* Pass the callback */}
          </div>
        </div>
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Skill Id</TableHead>
                  <TableHead className="w-[180px]">Skill Name</TableHead>
                  <TableHead className="w-[300px]">Created At</TableHead>
                  <TableHead className="w-[180px]">Created By</TableHead>
                  <TableHead className="w-[180px]">Status</TableHead>
                  <TableHead className="w-[20px]">Delete</TableHead>
                  <TableHead className="w-[20px]"></TableHead>
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
                ) : SkillData ? (
                  SkillData.map((Skill, index) => (
                    <TableRow key={Skill._id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Tooltip>
                            <TooltipTrigger>
                              <span>{formatID(Skill._id)}</span>
                            </TooltipTrigger>

                            <CopyButton id={Skill._id} />

                            <TooltipContent>
                              {Skill._id || "No Data Available"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>

                      <TableCell>{Skill.label}</TableCell>
                      <TableCell>
                        {Skill.createdAt || "No Data Available"}
                      </TableCell>
                      <TableCell>
                        {Skill.createdBy ? (
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger>
                                <span>{formatID(Skill.createdBy || "")}</span>
                              </TooltipTrigger>

                              <CopyButton id={Skill.createdBy || ""} />

                              <TooltipContent>
                                {Skill.createdBy || "No Data Available"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          "No Data Available"
                        )}
                      </TableCell>

                      <TableCell>
                        <Switch
                          checked={Skill.status === statusType.active}
                          onCheckedChange={(checked) =>
                            handleSwitchChange(Skill._id, checked, index)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <DeleteButtonIcon
                          onClick={() => handleDelete(Skill._id)}
                        />
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <ButtonIcon></ButtonIcon>
                          </DialogTrigger>
                          <DialogContent className="p-4">
                            <DialogHeader>
                              <DialogTitle>Skill Details</DialogTitle>
                            </DialogHeader>
                            <div>
                              <p>
                                <strong>Name:</strong> {Skill.label}
                              </p>
                              <p>
                                <strong>Description:</strong>{" "}
                                {Skill.description
                                  ? Skill.description
                                  : "No description available"}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
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

export default SkillTable;
