"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
import { useRouter } from "next/navigation"; // For navigation

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ButtonIcon } from "@/components/ui/arrowButton";
import { apiHelperService } from "@/services/business";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

interface UserData {
  _id: string; // Assuming your API returns this field for each business
  firstName: string;
  email: string;
  phone: string;
  skills: string[];
  domains: string[];
}

const BusinessTable: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiHelperService.getAllBusiness();
        console.log(response.data.data);
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle button click to navigate to tabs page with the business ID
  const handleViewBusiness = (id: string) => {
    router.push(`/business/tabs?id=${id}`); // Pass the ID as a query parameter
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
                ) : userData && userData.length > 0 ? (
                  userData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell className="text-center">
                        {user.skills?.length || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {user.domains?.length || 0}
                      </TableCell>
                      <TableCell>
                        <ButtonIcon
                          onClick={() => handleViewBusiness(user._id)}
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

export default BusinessTable;
