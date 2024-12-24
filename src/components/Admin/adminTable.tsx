"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";

import { ButtonIcon } from "../ui/arrowButton";
import { DeleteButtonIcon } from "../ui/deleteButton";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component

import AddAdmin from "./addAdmin";
import ConfirmationDialog from "../confirmationDialog";
import { useToast } from "@/components/ui/use-toast";
import { Messages, StatusEnum } from "@/utils/common/enum";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { apiHelperService } from "@/services/admin";
import { Badge } from "@/components/ui/badge"
import { getStatusBadge } from "@/utils/common/utils";
interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  type: string;
  status: StatusEnum;
  createdAt: string;
  updatedAt: string;
}

const AdminTable: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await apiHelperService.getAllAdmin();
      setUserData(response.data.data || []);
      if (response.data.data) {
        setUserData(response?.data?.data || []);
      }
      else {
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("admin"),
          variant: "destructive", // Red error message
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.FETCH_ERROR("admin"),
        variant: "destructive", // Red error message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleAddAdmin = async (newDomain: UserData) => {
    try {
      await fetchUserData(); // Fetch updated data after adding the admin
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.FETCH_ERROR("admin"),
        variant: "destructive", // Red error message
      });
    }
  };

  const handleDelete = async () => {
    if (selectedAdminId) {
      try {
        await apiHelperService.deleteAdmin(selectedAdminId);
        fetchUserData();
        toast({
          title: "Success",
          description: "Admin deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: Messages.DELETE_ERROR("admin"),
          variant: "destructive",
        });
      } finally {
        setDialogOpen(false);
        setSelectedAdminId(null);
      }
    }
  };

  const confirmDelete = (adminId: string) => {
    setSelectedAdminId(adminId);
    setDialogOpen(true);
  };


  return (
    <div className="px-4">
      <div className="mb-8 mt-4 ">
        <div className="flex items-center justify-between mb-4 ">
          <div className="flex-grow">
            <h2 className="table-title">Admin Table</h2>
          </div>
          <div>

            <AddAdmin onAddAdmin={handleAddAdmin} />
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
                  <TableHead className="w-[180px]">Email ID</TableHead>
                  <TableHead className="w-[180px]">Phone No.</TableHead>
                  <TableHead className="w-[180px]">Status</TableHead>
                  <TableHead className="w-[20px]">Delete</TableHead>
                  <TableHead className="w-[20px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <>
                    {[...Array(10)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-28" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-10" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-0 w-0" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : Array.isArray(userData) && userData.length > 0 ? (
                  userData.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.type}</TableCell>
                      <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell >
                        <Badge
                          className={
                            getStatusBadge(user.status)
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DeleteButtonIcon
                          onClick={() => confirmDelete(user._id)}
                        />
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <ButtonIcon />
                          </DialogTrigger>
                          <DialogContent className="p-6 sm:p-4 lg:p-6 rounded-lg shadow-lg max-w-lg sm:max-w-md mx-auto">
                            <DialogHeader className="mb-4">
                              <DialogTitle className="text-2xl font-semibold">Admin Details</DialogTitle>
                              <DialogDescription className="text-sm">Detailed information about the Admin.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <strong>ID:</strong>
                                <span>{user._id}</span>
                              </div>
                              <div className="flex justify-between">
                                <strong>First Name:</strong>
                                <span>{user.firstName}</span>
                              </div>
                              <div className="flex justify-between">
                                <strong>Last Name:</strong>
                                <span>{user.lastName}</span>
                              </div>
                              <div className="flex justify-between">
                                <strong>Username:</strong>
                                <span>{user.userName}</span>
                              </div>
                              <div className="flex justify-between">
                                <strong>Email ID:</strong>
                                <span>{user.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <strong>Phone No.:</strong>
                                <span>{user.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <strong>Type:</strong>
                                <span>{user.type}</span>
                              </div>
                              <div className="flex justify-between">
                                <strong>Status:</strong>
                                <span>{user.status}</span>
                              </div>
                              <div className="flex justify-between">
                                <strong>Created At:</strong>
                                <span>{user.createdAt}</span>
                              </div>
                              <div className="flex justify-between">
                                <strong>Updated At:</strong>
                                <span>{user.updatedAt}</span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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
      <ConfirmationDialog
        isOpen={dialogOpen}
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this admin? This action cannot be undone."
        confirmButtonName="Delete"
        cancelButtonName="Cancel"

      />
    </div>
  );
};

export default AdminTable;
