"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { apiHelperService } from "@/services/freelancer";
import { ButtonIcon } from "@/components/ui/arrowButton";

interface UserData {
  _id: string;
  firstName: string;
  email: string;
  phone: string;
  skills: string[];
  domain: string[];
}

const FreelancerTable: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        //GET API service example usage
        const response = await apiHelperService.getAllFreelancers();
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleRedirect = (id: string) => {
    router.push(`/freelancer/tabs?id=${id}`);
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email ID</TableHead>
                  <TableHead>Phone No.</TableHead>
                  <TableHead className="text-center">Skill Count</TableHead>
                  <TableHead className="text-center">Domain Count</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Skeletons displayed while loading
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
                        <TableCell className="text-center ">
                       < div className="flex justify-center items-center">
                         <Skeleton className="h-5 w-10" />
                       </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-6 justify-items-center" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : userData?.length > 0 ? (
                  userData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell className="text-center">
                        {user.skills?.length || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {user.domain?.length || 0}
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <ButtonIcon
                          onClick={() => handleRedirect(user._id)}
                        ></ButtonIcon>
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

export default FreelancerTable;
