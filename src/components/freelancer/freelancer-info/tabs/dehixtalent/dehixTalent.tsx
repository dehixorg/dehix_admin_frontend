"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { apiHelperService } from "@/services/freelancer";
import { useToast } from "@/components/ui/use-toast";
import { Messages, formatID } from "@/utils/common/enum";
import CopyButton from "@/components/copybutton";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface Talent {
  _id: string;
  talentId: string;
  talentName: string;
  type: string; // e.g., "SKILL"
  status: string; // e.g., "pending"
  experience: string;
  monthlyPay: string;
  activeStatus: boolean;
  interviews: any[]; // Assuming this is an array of objects
}

interface DehixTalentData {
  dehixTalent: Talent[];
}

interface DehixTalentProps {
  id: string;
  profile?: any;
}

const DehixTalent: React.FC<DehixTalentProps> = ({ profile: _profile, id }) => {
  const [talentData, setTalentData] = useState<DehixTalentData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTalentData = async () => {
      try {
        const response = await apiHelperService.getAllFreelancerPersonalInfo(id);
        const dehixTalent = Object.values(response.data.data.dehixTalent ?? {}) as Talent[];
        setTalentData({ dehixTalent });
      } catch (error) {
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("Dehix Talent"),
          variant: "destructive", // Red error message
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTalentData();
    }
  }, [id, toast]);

  return (
    <div className="">
      <div className="mb-8 mt-4">
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Monthly Pay</TableHead>
                  <TableHead>Talent ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : talentData && talentData.dehixTalent.length > 0 ? (
                  talentData.dehixTalent.map((talent) => (
                    <TableRow key={talent._id}>
                      <TableCell>{talent.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Tooltip>
                            <TooltipTrigger>
                              <span>{formatID(talent._id)}</span>
                            </TooltipTrigger>
                            <CopyButton id={talent._id} />
                            <TooltipContent>
                              {talent._id || "No Data Available"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell>{talent.talentName}</TableCell>
                      <TableCell>{talent.experience}</TableCell>
                      <TableCell>{talent.status}</TableCell>
                      <TableCell>{talent.monthlyPay}</TableCell>
                      <TableCell>{talent.talentId}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen
                          className="mx-auto text-gray-500"
                          size="100"
                        />
                        <p className="text-gray-500">
                          No Dehix Talent data available.
                          <br /> This feature will be available soon.
                          <br />
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
    </div>
  );
};

export default DehixTalent;