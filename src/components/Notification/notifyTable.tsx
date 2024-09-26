"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen, Eye, Trash2 } from "lucide-react";

import AddNotify from "./addNotify";

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
import { Switch } from "@/components/ui/switch";

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(
          `/notification/all_notification`,
        );
        setUserData(response.data.data);
      } catch (error) {
        console.log("this is an error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDelete = async (faqId: string) => {
    if (!faqId) {
      return;
    }
    try {
      await axiosInstance.delete(`/notification/${faqId}`); // Update delete API endpoint
      setUserData((prevData) => prevData.filter((user) => user._id !== faqId));
    } catch (error) {
      console.log("error");
    }
  };

  const handleSwitchChange = (faqId: string, checked: boolean) => {
    setUserData((prevData) =>
      prevData.map((user) =>
        user._id === faqId
          ? { ...user, status: checked ? "active" : "inactive" }
          : user,
      ),
    );
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <AddNotify />
          </div>
        </div>
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Type</TableHead>
                  <TableHead className="w-[180px]">Status</TableHead>
                  <TableHead className="w-[180px]">Heading</TableHead>
                  <TableHead className="w-[180px]">URL Count</TableHead>
                  <TableHead className="w-[180px]">Switch</TableHead>
                  <TableHead className="w-[180px]">Details</TableHead>
                  <TableHead className="w-[180px]">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : userData.length > 0 ? (
                  userData.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.type}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>{truncateText(user.heading, 20)}</TableCell>
                      <TableCell>{user.importantUrl.length}</TableCell>
                      <TableCell>
                        <Switch
                          checked={user.status === "active"}
                          onCheckedChange={(checked) =>
                            handleSwitchChange(user._id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Eye className="cursor-pointer text-gray-500 active:scale-150 hover:text-blue-500" />
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
                                <div className="mt-4">
                                  <img
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
                              <ul className="list-disc list-inside">
                                {user.importantUrl.length > 0 ? (
                                  user.importantUrl.map((url, urlIndex) => (
                                    <li key={urlIndex}>
                                      <p>
                                        <strong>URL Name:</strong> {url.urlName}
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
