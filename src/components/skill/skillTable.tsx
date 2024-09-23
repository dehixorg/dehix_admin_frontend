import React, { useState, useEffect } from "react";
import { PackageOpen, Eye, Trash2 } from "lucide-react";

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
import { axiosInstance } from "@/lib/axiosinstance";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

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

  // Function to fetch Skill data
  const fetchSkillData = async () => {
    setLoading(true);
    setNoData(false); // Reset noData state before fetching
    try {
      const response = await axiosInstance.get("/skills/all");
      if (response.data.data.length === 0) {
        setNoData(true); // Set noData if response is empty
      } else {
        setSkillData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Skill data:", error);
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
    if (!SkillId) {
      console.error("Skill ID is undefined.");
      return;
    }
    try {
      await axiosInstance.delete(`/skills/${SkillId}`);
      fetchSkillData(); // Re-fetch data after deletion
    } catch (error: any) {
      console.error(
        "Error deleting Skill:",
        error.response?.data || error.message,
      );
    }
  };

  const handleSwitchChange = (labelId: string, checked: boolean) => {
    setSkillData((prevData) =>
      prevData.map((user) =>
        user._id === labelId
          ? { ...user, status: checked ? "active" : "inactive" }
          : user,
      ),
    );
  };
  // Callback to re-fetch Skill data after adding a new Skill
  const handleAddSkill = async () => {
    try {
      // Optionally post newSkill if needed
      await fetchSkillData(); // Fetch updated data after adding the Skill
    } catch (error) {
      console.error("Error adding Skill:", error);
    }
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <AddSkill onAddSkill={handleAddSkill} />{" "}
            {/* Pass the callback */}
          </div>
        </div>
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Skill Name</TableHead>
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
                ) : SkillData.length > 0 ? (
                  SkillData.map((Skill) => (
                    <TableRow key={Skill._id}>
                      <TableCell>{Skill.label}</TableCell>
                      <TableCell>
                        {Skill.createdAt || "No Data Available"}
                      </TableCell>
                      <TableCell>
                        {Skill.createdBy || "No Data Available"}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={Skill.status === "active"}
                          onCheckedChange={(checked) =>
                            handleSwitchChange(Skill._id, checked)
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
                      <TableCell>
                        <Trash2
                          className="cursor-pointer text-gray-500 hover:text-red-500"
                          onClick={() => handleDelete(Skill._id)}
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

export default SkillTable;
