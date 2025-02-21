"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
import Image from "next/image";

import { DeleteButtonIcon } from "../ui/deleteButton";
import AddNotify from "./addNotify";

import { useToast } from "@/components/ui/use-toast";
import {
  Messages,
  NotificationStatusEnum,
  statusType,
} from "@/utils/common/enum";
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
import { Skeleton } from "@/components/ui/skeleton";
import { apiHelperService } from "@/services/notification";
import { DotFilledIcon } from "@radix-ui/react-icons";

interface ImportantUrl {
  urlName: string;
  url: string;
}

interface UserData {
  _id: string;
  heading: string;
  description: string;
  type: string;
  status: statusType;
  background_img: string;
  importantUrl: ImportantUrl[];
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
      setUserData(response.data.data);
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

  const handleDelete = async (notificationId: string) => {
    try {
      await apiHelperService.deleteNotification(notificationId);
      setUserData((prevData) =>
        prevData.filter((user) => user._id !== notificationId)
      );
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
    index: number
  ) => {
    try {
      setUserData((prevUserData) => {
        const updatedUserData = [...prevUserData];
        updatedUserData[index].status = checked
          ? statusType.ACTIVE
          : statusType.INACTIVE;
        return updatedUserData;
      });
      await apiHelperService.updateNotificationStatus(
        labelId,
        checked ? statusType.ACTIVE : statusType.INACTIVE
      );
      toast({
        title: "Success",
        description: `Notification status updated to ${
          checked ? statusType.ACTIVE : statusType.INACTIVE
        }`,
        variant: "default",
      });
    } catch (error) {
      setUserData((prevUserData) => {
        const updatedUserData = [...prevUserData];
        updatedUserData[index].status = checked
          ? statusType.INACTIVE
          : statusType.ACTIVE;
        return updatedUserData;
      });
      toast({
        title: "Error",
        description: "Failed to update notification status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="table-title">Notification Table</h2>
          <AddNotify onAddNotify={fetchUserData} />
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
                          checked={user.status === "ACTIVE"}
                          onCheckedChange={(checked) =>
                            handleSwitchChange(user._id, checked, index)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteButtonIcon
                          onClick={() => handleDelete(user._id)}
                        />
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <ButtonIcon />
                          </DialogTrigger>
                          <DialogContent className="p-4 max-h-[80%] overflow-y-scroll">
                            <DialogHeader>
                              <DialogTitle>Notification Details</DialogTitle>
                              <DialogDescription>
                                Detailed information about the Notification.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-start justify-start gap-0">
                              <h1 className="text-3xl w-full text-center font-medium text-neutral-900">
                                {user.heading}
                              </h1>
                              <p className="text-sm text-gray-500 mb-2">
                                {user.type}
                              </p>
                              <p className=" mb-2">{user.description}</p>
                              {user.background_img !== "" && (
                                <Image
                                  src={user.background_img}
                                  alt="notification"
                                  width={2000}
                                  height={2000}
                                  className="w-full h-fit"
                                />
                              )}
                              <div className="mt-4 text-sm text-gray-800">
                                Important URLs:
                                {user.importantUrl.map((url, index) => (
                                  <div key={index}>
                                    <span className="ml-2 text-sm text-gray-600">
                                      <DotFilledIcon className="inline mr-2" />
                                      {url.urlName} :{" "}
                                    </span>
                                    <a
                                      key={index}
                                      href={url.url}
                                      target="_blank"
                                      className="text-blue-500 underline text-sm" rel="noreferrer"
                                    >
                                      {url.url}
                                    </a>
                                  </div>
                                ))}
                              </div>
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
