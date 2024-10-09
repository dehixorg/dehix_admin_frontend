"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen, Trash2 } from "lucide-react";

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
import { ButtonIcon } from "@/components/ui/eyeButton";
import { Switch } from "@/components/ui/switch";
import { apiHelperService } from "@/services/faq";

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiHelperService.getAllFaq();
        console.log("API Response:", response.data);
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDelete = async (faqId: string) => {
    console.log("FAQ ID received in handleDelete:", faqId); // Debugging line
    if (!faqId) {
      console.error("FAQ ID is undefined.");
      return;
    }
    try {
      await apiHelperService.deleteFaq(faqId);
      setUserData((prevData) => prevData.filter((user) => user._id !== faqId));
    } catch (error: any) {
      console.error(
        "Error deleting FAQ:",
        error.response?.data || error.message
      );
    }
  };

  const handleSwitchChange = (faqId: string, checked: boolean) => {
    setUserData((prevData) =>
      prevData.map((user) =>
        user._id === faqId
          ? { ...user, status: checked ? "active" : "inactive" }
          : user
      )
    );
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
                      <TableCell>{truncateText(user.question, 20)}</TableCell>
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
                            <ButtonIcon variant="outline"></ButtonIcon>
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

export default FaqTable;
