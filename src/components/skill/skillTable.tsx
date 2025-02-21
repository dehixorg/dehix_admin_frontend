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
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import EditSkillDescription from "@/components/skill/editSkilldesc";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
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

  const handleDescButtonClick = (index: number) => {
    setSelectedIndex(index);
    setIsDialogOpen(true);
  };
  const handleEditButtonClick = () => {
    setIsDialogOpen(false);
    setIsEditDialogOpen(true);
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
          ? statusType.ACTIVE
          : statusType.INACTIVE;

        // Return the updated array
        return updatedSkillData;
      });
      await apiHelperService.updateSkillStatus(
        labelId,
        checked ? statusType.ACTIVE : statusType.INACTIVE,
      );
      toast({
        title: "Success",
        description: `Skill status updated to ${checked ? statusType.ACTIVE : statusType.INACTIVE}`,
        variant: "default",
      });
    } catch (error) {
      // Revert the status change if the API call fails
      setSkillData((prevSkillData) => {
        // Create a shallow copy of the existing array
        const updatedSkillData = [...prevSkillData];

        updatedSkillData[index].status = checked
          ? statusType.INACTIVE
          : statusType.ACTIVE;

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
      <div className="mb-8 mt-4 mr-4">
        <div className="flex items-center justify-between mb-4 ">
          <div className="flex-grow">
            <h2 className="table-title">Skill Table</h2>
          </div>
          <div>
            <AddSkill onAddSkill={fetchSkillData} skillData={SkillData} />
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
                        {formatTime(Skill.createdAt) || "No Data Available"}
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
                          checked={Skill.status === statusType.ACTIVE}
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
                        <ButtonIcon variant="outline"
                                  onClick={() => {
                                 handleDescButtonClick(index);
                                        }} />
                                    </TableCell>
                    
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          
                          <DialogContent className="p-4">
                            <DialogHeader>
                              
                              <DialogTitle>Skill Details</DialogTitle>
                            </DialogHeader>
                            <div>
                            {selectedIndex!=-1? (
                            <div>
                              <p>
                                <strong>Name:</strong> {SkillData[selectedIndex].label}
                              </p>
                              <p>
                                <strong>Description:</strong>
                                {SkillData[selectedIndex].description
                                  ? SkillData[selectedIndex].description
                                  : "No description available"}
                              </p>
                              <Button
                            variant="outline"
                            onClick={() => {
                              handleEditButtonClick();
                            }}
                          >
                            Edit Description
                          </Button>
                            
                            </div>
                          ) : (
                            <p>No skill selected.</p>
                          )}
                        </div>
                          </DialogContent>
                        </Dialog>
                       
                        {isEditDialogOpen &&selectedIndex &&<EditSkillDescription
                        isDialogopen= {isEditDialogOpen}
                            setIsDialogOpen={() => setIsEditDialogOpen(false)} 
                              skillId={SkillData[selectedIndex]._id}
                              currentDescription={SkillData[selectedIndex].description || ""}
                              onDescriptionUpdate={(newDescription:string) => {
                                setSkillData((prevSkillData) => {
                                  const updatedSkillData = [...prevSkillData];
                                  updatedSkillData[selectedIndex].description = newDescription;
                                  return updatedSkillData;
                                });
                              }}
                            />}
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
