"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
import Image from "next/image";

import { DeleteButtonIcon } from "../ui/deleteButton";
import AddNotify from "./addNotify";

import { useToast } from "@/components/ui/use-toast";
import { Messages, statusType } from "@/utils/common/enum";
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
import { ButtonIcon } from "@/components/ui/arrowButton";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import { apiHelperService } from "@/services/notification";

interface ImportantUrl {
  urlName: string;
  url: string;
}

interface UserData {
  _id: string;
  heading: string;
  description: string;
  type: string;
  status: string;
  background_img: string;
  importantUrl: ImportantUrl[];
  // AWS image URL
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const NotifyTable: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
    const fetchUserData = async () => {
      try {
        const response = await apiHelperService.getAllNotification();
        setUserData(response.data.data||[]);
      } catch (error) {
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("notification"),
          variant: "destructive", 
        });
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
    fetchUserData();
  }, []);

  const handleDelete = async (faqId: string) => {
    try {
      await apiHelperService.deleteNotification(faqId);
      setUserData((prevData) => prevData.filter((user) => user._id !== faqId));
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.DELETE_ERROR("notification"),
        variant: "destructive", 
      });
    }
  };

  const handleSwitchChange = async (
    labelId: string,
    checked: boolean,
    index: number,
  ) => {
    // Initialize toast

    try {
      setUserData((prevUserData) => {
        // Create a shallow copy of the existing array
        const updatedUserData = [...prevUserData];

        updatedUserData[index].status = checked
          ? statusType.active
          : statusType.inactive;

        // Return the updated array
        return updatedUserData;
      });
      await apiHelperService.updateNotificationStatus(
      labelId,
      checked ? statusType.active : statusType.inactive,
      );

      toast({
        title: "Success",
        description: `Notification status updated to ${checked ? statusType.active : statusType.inactive}`,
        variant: "default",
      });
    } catch (error) {
      // Revert the status change if the API call fails
      setUserData((prevUserData) => {
        // Create a shallow copy of the existing array
        const updatedUserData = [...prevUserData];

        updatedUserData[index].status = checked
          ? statusType.inactive
          : statusType.active;

        // Return the updated array
        return updatedUserData;
      });
      toast({
        title: "Error",
        description: "Failed to update dfaq status. Please try again.",
        variant: "destructive", // Red error message
      });
    }
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <AddNotify onAddNotify={fetchUserData}/>
          </div>
        </div>
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Heading</TableHead>
                  <TableHead className="text-center">URL Count</TableHead>
                  <TableHead>Switch</TableHead>
                  <TableHead className="w-[20px]">Delete</TableHead>
                  <TableHead className="w-[20px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Skeleton Loader
                  <>
                    {[...Array(10)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-14" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-48" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-8 mx-auto" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-7 w-12 rounded-3xl" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-10" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : userData.length > 0 ? (
                  userData.map((user, index) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.type}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>{truncateText(user.heading, 20)}</TableCell>
                      <TableCell className="text-center">
                        {user.importantUrl.length}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={user.status === "active"}
                          onCheckedChange={(checked) =>
                            handleSwitchChange(user._id, checked, index)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <DeleteButtonIcon
                          onClick={() => handleDelete(user._id)}
                        />
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <ButtonIcon></ButtonIcon>
                          </DialogTrigger>
                          <DialogContent className="p-4">
                            <DialogHeader>
                              <DialogTitle>Notification Details</DialogTitle>
                              <DialogDescription>
                                Detailed information about the Notification.
                              </DialogDescription>
                            </DialogHeader>
                            <div>
                              <p>
                                <strong>Type:</strong> {user.type}
                              </p>
                              <p>
                                <strong>Status:</strong> {user.status}
                              </p>
                              <p>
                                <strong>Heading:</strong> {user.heading}
                              </p>
                              <p>
                                <strong>Description:</strong> {user.description}
                              </p>
                              {user.background_img && (
                                <div className="mt-4 w-40 h-40 border-2 border-black-300 bg-gray-700 flex items-center justify-center cursor-pointer">
                                  <Image
                                    width={32}
                                    height={32}
                                    src={user.background_img} // AWS image URL
                                    alt="Notification"
                                    className="w-full h-auto"
                                  />
                                </div>
                              )}
                              <p>
                                <strong>URL Count:</strong>{" "}
                                {user.importantUrl.length}
                              </p>
                              <ul className=" list-inside">
                                {user.importantUrl.length > 0 ? (
                                  user.importantUrl.map((url, urlIndex) => (
                                    <li key={urlIndex}>
                                      <p>
                                        <strong>URL Name:</strong>{url.urlName}
                                      </p>
                                      <p>
                                        <strong>URL:</strong>{" "}
                                        <a
                                          href={url.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-500 underline"
                                        >
                                          {url.url}
                                        </a>
                                      </p>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-gray-500">
                                    No URLs available
                                  </li>
                                )}
                              </ul>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
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

export default NotifyTable;
