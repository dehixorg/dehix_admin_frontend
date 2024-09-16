"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen, Eye, Trash2 } from "lucide-react";

import AddAdmin from "./addAdmin";

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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const AdminTable: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/all");
      console.log("API Response:", response.data);
      setUserData(response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleAddDomain = async (newDomain: UserData) => {
    try {
      // Assuming an API call is made in the AddAdmin component
      await fetchUserData(); // Fetch updated data after adding the admin
    } catch (error) {
      console.error("Error adding domain:", error);
    }
  };

  const handleDelete = async (admin_id: string) => {
    console.log("Admin ID received in handleDelete:", admin_id); // Debugging line
    if (!admin_id) {
      console.error("Admin ID is undefined.");
      return;
    }
    try {
      await axiosInstance.delete(`/admin/${admin_id}`);
      setUserData((prevData) =>
        prevData.filter((user) => user._id !== admin_id),
      );
    } catch (error: any) {
      console.error(
        "Error deleting admin:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <AddAdmin onAddDomain={handleAddDomain} />
          </div>
        </div>
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Type</TableHead>
                  <TableHead className="w-[180px]">Name</TableHead>
                  <TableHead className="w-[180px]">Username</TableHead>
                  <TableHead className="w-[180px]">Email</TableHead>
                  <TableHead className="w-[180px]">Phone-No.</TableHead>
                  <TableHead className="w-[180px]">Status</TableHead>
                  <TableHead className="w-[180px]">More</TableHead>
                  <TableHead className="w-[180px]">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : userData.length > 0 ? (
                  userData.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.type}</TableCell>
                      <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="p-4">
                            <DialogHeader>
                              <DialogTitle>Admin Details</DialogTitle>
                              <DialogDescription>
                                Detailed information about the Admin.
                              </DialogDescription>
                            </DialogHeader>
                            <div>
                              <p>
                                <strong>ID:</strong> {user._id}
                              </p>
                              <p>
                                <strong>First Name:</strong> {user.firstName}
                              </p>
                              <p>
                                <strong>Last Name:</strong> {user.lastName}
                              </p>
                              <p>
                                <strong>Username:</strong> {user.userName}
                              </p>
                              <p>
                                <strong>Email:</strong> {user.email}
                              </p>
                              <p>
                                <strong>Phone:</strong> {user.phone}
                              </p>
                              <p>
                                <strong>Type:</strong> {user.type}
                              </p>
                              <p>
                                <strong>Status:</strong> {user.status}
                              </p>
                              <p>
                                <strong>Created At:</strong> {user.createdAt}
                              </p>
                              <p>
                                <strong>Updated At:</strong> {user.updatedAt}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <Trash2
                          className="cursor-pointer text-gray-500 hover:text-red-500"
                          onClick={() => handleDelete(user._id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
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

export default AdminTable;
