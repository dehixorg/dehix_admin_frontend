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
  hireId: string;
  businessId?: string;
  freelancer_professional_profile_id?: string;
  attributeId: string;
  attributeName?: string;
  status: string;
  payType?: string;
  payAmount?: number;
  updatedAt?: Date;
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
                  <TableHead>ID</TableHead>
                  <TableHead>Hire ID</TableHead>
                  <TableHead>Business ID</TableHead>
                  <TableHead>Attribute ID</TableHead>
                  <TableHead>Attribute Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pay Type</TableHead>
                  <TableHead>Pay Amount</TableHead>
                  <TableHead>Updated At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : talentData && talentData.dehixTalent.length > 0 ? (
                  talentData.dehixTalent.map((talent) => (
                    <TableRow key={talent._id}>
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
                      <TableCell>{talent.hireId || "N/A"}</TableCell>
                      <TableCell>{talent.businessId || "N/A"}</TableCell>
                      <TableCell>{talent.attributeId || "N/A"}</TableCell>
                      <TableCell>{talent.attributeName || "N/A"}</TableCell>
                      <TableCell>{talent.status || "N/A"}</TableCell>
                      <TableCell>{talent.payType || "N/A"}</TableCell>
                      <TableCell>
                        {talent.payAmount ? `₹${talent.payAmount.toLocaleString()}` : "N/A"}
                      </TableCell>
                      <TableCell>
                        {talent.updatedAt ? new Date(talent.updatedAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
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