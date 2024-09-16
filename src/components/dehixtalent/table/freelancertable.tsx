"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen, Eye, Copy } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { axiosInstance } from "@/lib/axiosinstance";
import { Button } from "@/components/ui/button";

interface UserData {
  _id: string;
  skillId?: string;
  skillName?: string;
  domainId?: string;
  domainName?: string;
  status?: string;
  activestatus?: string;
  activeStatus?: string;
}
interface talentdata {
  _id: string;
  dehixTalent: object[];
}

const FreelancerTable: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/freelancer/dehixTalent");
        console.log(response.data.data);
        const fetchedData = response.data.data;

        // Extract dehixTalent and merge into a single array
        const dehixTalentData: UserData[] = fetchedData.flatMap(
          (item: talentdata) => Object.values(item.dehixTalent),
        );

        console.log(dehixTalentData);
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  const formatID = (id: string) => {
    if (id.length <= 7) return id;
    return `${id.substring(0, 5)}...${id.substring(id.length - 2)}`;
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);


  };

  
  const handleproject = (id: string) => {
    router.push(`/business/tabs?id=${id}`); 
  };
  const handleViewBusiness = (id: string) => {
    router.push(`/business/tabs?id=${id}`); 
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Skill-Id</TableHead>
                  <TableHead>Skill Name </TableHead>
                  <TableHead>Domain Id</TableHead>
                  <TableHead>Domain Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ActiveStatus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : userData.length > 0 ? (
                  userData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {user._id ? (
                            <>
                              <span
                                onClick={() => handleproject(user._id)}
                                className="cursor-pointer text-blue-500 hover:underline"
                              >
                                {formatID(user._id)}
                              </span>
                              <Button
                                onClick={() => handleCopy(user._id)}
                                variant="outline"
                                size="sm"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <span>No data available</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {user.skillName || "No Data Available"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {user.skillId ? (
                            <>
                              <span className="cursor-pointer text-blue-500">
                                {formatID(user.skillId || "")}
                              </span>
                              <Button
                                onClick={() => handleCopy(user.skillId || "")}
                                variant="outline"
                                size="sm"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <span>No data available</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {user.domainName || "No Data Available"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {user.domainId ? (
                            <>
                              <span className="cursor-pointer text-blue-500">
                                {formatID(user.domainId || "")}
                              </span>
                              <Button
                                onClick={() => handleCopy(user.domainId || "")}
                                variant="outline"
                                size="sm"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <span>No data available</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.status || "No Data Available"}
                      </TableCell>
                      <TableCell>
                        {user.activestatus || "No Data Available"}
                      </TableCell>

                      <TableCell>
                        <Button onClick={() => handleViewBusiness(user._id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
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
    </div>
  );
};

export default FreelancerTable;
