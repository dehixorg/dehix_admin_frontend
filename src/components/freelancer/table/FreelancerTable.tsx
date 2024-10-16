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
        //TODO: replace this with actual freelance api service function after creation
        const response = await apiHelperService.getAllFreelancers();
        // const response = await axiosInstance.get("/freelancer/allfreelancer");
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
      <div className="mb-8 mt-2 lex items-center justify-between mr-4">
        <div className="flex-grow mb-4">
          <h2 className="text-xl font-semibold">Freelancer Table</h2>
        </div>
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
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
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
