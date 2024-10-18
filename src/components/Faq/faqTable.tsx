"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component

import { DeleteButtonIcon } from "../ui/deleteButton";
import AddFaq from "./addFaq";

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
import { apiHelperService } from "@/services/faq";
import { useToast } from "@/components/ui/use-toast";
import { Messages, statusType } from "@/utils/common/enum";
interface ImportantUrl {
  urlName: string;
  url: string;
}
interface UserData {
  _id: string;
  question: string;
  answer: string;
  type: string;
  status: string;
  importantUrl: ImportantUrl[];
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const FaqTable: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserData = async () => {
    try {
      const response = await apiHelperService.getAllFaq();
      setUserData(response.data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.FETCH_ERROR("faq"),
        variant: "destructive", // Red error message
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
      await apiHelperService.deleteFaq(faqId);
      fetchUserData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: Messages.DELETE_ERROR("faq"),
        variant: "destructive", // Red error message
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
      //await apiHelperService.updateFaqStatus(
      //labelId,
      //checked ? statusType.active : statusType.inactive,
      //);

      toast({
        title: "Success",
        description: `Faq status updated to ${checked ? statusType.active : statusType.inactive}`,
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
        description: "Failed to update faq status. Please try again.",
        variant: "destructive", // Red error message
      });
    }
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <AddFaq />
          </div>
        </div>
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Type</TableHead>
                  <TableHead className="w-[180px]">Status</TableHead>
                  <TableHead className="w-[180px]">Question</TableHead>
                  <TableHead className="text-center">URL Count</TableHead>
                  <TableHead className="w-[180px]">Switch</TableHead>
                  <TableHead className="w-[20px]">Delete</TableHead>
                  <TableHead className="w-[20px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Render skeleton when loading
                  <>
                    {[...Array(9)].map((_, i) => (
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
                      <TableCell>{truncateText(user.question, 20)}</TableCell>
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
                          <DialogContent className="p-4">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>
                                Detailed information about the user.
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
                                <strong>Question:</strong> {user.question}
                              </p>
                              <p>
                                <strong>Answer:</strong> {user.answer}
                              </p>
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

export default FaqTable;
