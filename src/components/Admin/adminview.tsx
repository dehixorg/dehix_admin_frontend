"use client";

import { useEffect, useState } from "react";
import {  PackageOpen , Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { RootState } from '@/lib/store';
import {useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { apiHelperService } from "@/services/admin";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { AdminAccountStatus, AdminType, AdminPasswordStatus, Messages } from "@/utils/common/enum";
import { Badge } from "@/components/ui/badge";
import { getStatusBadge } from "@/utils/common/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface IChangePasswordRequest {
  requestedAt: Date;
  passwordStatus: AdminPasswordStatus;
  acceptedBy?: string;
}

interface AdminData {
  _id?: string;
  profilePic: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  status: AdminAccountStatus;
  type: AdminType;
  changePasswordRequests: IChangePasswordRequest[];
  resetRequest: boolean;
}
interface CurrentUserDetailsProps {
    id: string;
  }

  const CurrentUserDetails = ({ id }: CurrentUserDetailsProps) => {
const user = useSelector((state: RootState) => state.user);
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [passwordError, setPasswordError] = useState("");

const [loading, setLoading] = useState<boolean>(true);
const [adminData, setAdminData] = useState<AdminData | null>(null);
const [openDialog, setOpenDialog] = useState(false);
const { toast } = useToast();

const fetchAdmin = async () => {
  try {
    const response = await apiHelperService.getAdminInfo(id);
    if (response.data && response.data.data) {
        setAdminData(response.data.data);
    } else {
      toast({
        title: "Error",
        description: Messages.FETCH_ERROR("admin"),
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Error",
      description: Messages.FETCH_ERROR("admin"),
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchAdmin();
}, [id]);

const handleResetPassword = async () => {
  if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    setPasswordError("");
    // Proceed with password reset logic
  try {
      const updatedRequests = [...adminData!.changePasswordRequests];
      const lastRequestIndex = updatedRequests.length - 1;
      
      updatedRequests[lastRequestIndex] = {
        ...updatedRequests[lastRequestIndex],
        "passwordStatus": AdminPasswordStatus.COMPLETED,
        "acceptedBy": user.uid || "N/A",
      };
  
      const payload = {
        "password": newPassword,
       "resetRequest": false,
        "changePasswordRequests": updatedRequests,
       };
    await apiHelperService.updateAdminPassword(id,payload);
    toast({
      title: "Success",
      description: "Password reset successfully",
      variant: "default",
    });
   fetchAdmin();
    setOpenDialog(false);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to reset password",
      variant: "destructive",
    });
  }
};
return (
    loading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-full" />
        </div>
      ) : adminData ? (
        <Card>
          <CardHeader  >
            <div className="flex items-center justify-between mb-4">
          <CardTitle>Admin Details</CardTitle>
          {adminData?.resetRequest && (
  <Button onClick={() => setOpenDialog(true)} variant="destructive">
    Reset Password
  </Button>
)}
</div>
</CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="font-medium">Name:</p>
              <p className="text-muted-foreground">
                {adminData.firstName} {adminData.lastName}
              </p>
            </div>
            <div>
              <p className="font-medium">Username:</p>
              <p className="text-muted-foreground">{adminData.userName}</p>
            </div>
            <div>
              <p className="font-medium">Email:</p>
              <p className="text-muted-foreground">{adminData.email}</p>
            </div>
            <div>
              <p className="font-medium">Phone:</p>
              <p className="text-muted-foreground">{adminData.phone}</p>
            </div>
            <div>
              <p className="font-medium">Status:</p>
              <Badge className={getStatusBadge(adminData.status)}>
                {adminData.status}
              </Badge>
            </div>
            <div>
              <p className="font-medium">Type:</p>
              <p className="text-muted-foreground">{adminData.type}</p>
            </div>
          </CardContent>

          <p className="text-lg font-semibold mt-8 ml-4">Change Password Requests</p>
          {adminData.changePasswordRequests.length > 0 ? (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Requested At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Accepted By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminData.changePasswordRequests.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(request.requestedAt).toLocaleString()}</TableCell>
                    <TableCell>
                    <Badge className={getStatusBadge(request.passwordStatus)}>
                {request.passwordStatus}
              </Badge>
                    </TableCell>
                    <TableCell>{request.acceptedBy || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground mt-4">No Password Change Requests Available</p>
          )}

<Dialog open={openDialog} onOpenChange={setOpenDialog}>
<DialogContent>
<DialogHeader>
  <h2 className="text-xl font-semibold">Confirm Password Reset</h2>
</DialogHeader>
<div className="space-y-4">
  <div className="relative">
    <Input 
      type={showPassword ? "text" : "password"}
      placeholder="New Password"
      className="w-full pr-10"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />
    <button
      type="button"
      className="absolute inset-y-0 right-3 flex items-center"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  </div>

  <div className="relative">
    <Input
      type={showPassword ? "text" : "password"}
      placeholder="Confirm New Password"
      className="w-full pr-10"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />
    <button
      type="button"
      className="absolute inset-y-0 right-3 flex items-center"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  </div>

  {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
</div>
<DialogFooter>
  <Button variant="outline" onClick={() => setOpenDialog(false)}>
    Cancel
  </Button>
  <Button variant="destructive" onClick={handleResetPassword}>
    Confirm
  </Button>
</DialogFooter>
</DialogContent>
</Dialog>
        </Card>
        
      ) : (
        <div className="text-center py-10 w-full mt-10">
        <PackageOpen className="mx-auto text-gray-500" size="100" />
        <p className="text-gray-500">
          No data available.
          <br /> This feature will be available soon.
          <br />
          Here you can get directly hired for different roles.
        </p>
      </div>
      )
);

};

export default CurrentUserDetails;