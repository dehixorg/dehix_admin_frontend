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
import { Messages, statusType , formatID } from "@/utils/common/enum";
import CopyButton from "@/components/copybutton";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface Skill {
  _id: string;
  name: string;
  level: string;
  experience: string;
  interviewStatus: string;
  interviewInfo: string;
  interviewerRating: number;
}

interface Domain {
  _id: string;
  name: string;
  level: string;
  experience: string;
  interviewStatus: string;
  interviewInfo: string;
  interviewerRating: number;
}

interface UserData {
  skills: Skill[];
  domain: Domain[];
}

interface SkillDomainProps {
  id: string;
}
const SkillDomain: React.FC<SkillDomainProps> = ({ id }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("id", id);
    const fetchUserData = async () => {
      try {
        const response =
          await apiHelperService.getAllFreelancerPersonalInfo(id);
        const { skills, domain } = response.data;
        setUserData({ skills, domain });
      } catch (error) {
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("skill and domain"),
          variant: "destructive", // Red error message
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  return (
    <div className="">
      <div className="mb-8 mt-4">
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Interview-Status</TableHead>
                  <TableHead>Interview-Info</TableHead>
                  <TableHead>Interviewer-Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : userData ? (
                  <>
                    {userData.skills.map((skill) => (
                      <TableRow key={skill._id}>
                        <TableCell>Skill</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger>
                                <span>{formatID(skill._id)}</span>
                              </TooltipTrigger>

                              <CopyButton id={skill._id} />

                              <TooltipContent>
                                {skill._id || "No Data Available"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                        <TableCell>{skill.name}</TableCell>
                        <TableCell>{skill.level}</TableCell>
                        <TableCell>{skill.experience}</TableCell>
                        <TableCell>{skill.interviewStatus}</TableCell>
                        <TableCell>{skill.interviewInfo}</TableCell>
                        <TableCell>{skill.interviewerRating}</TableCell>
                      </TableRow>
                    ))}
                    {userData.domain.map((domain) => (
                      <TableRow key={domain._id}>
                        <TableCell>Domain</TableCell>
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
                        </TableCell>{" "}
                        <TableCell>{domain.name}</TableCell>
                        <TableCell>{domain.level}</TableCell>
                        <TableCell>{domain.experience}</TableCell>
                        <TableCell>{domain.interviewStatus}</TableCell>
                        <TableCell>{domain.interviewInfo}</TableCell>
                        <TableCell>{domain.interviewerRating}</TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen
                          className="mx-auto text-gray-500"
                          size="100"
                        />
                        <p className="text-gray-500">
                          No data available.
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

export default SkillDomain;
