"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen, Copy } from "lucide-react";
import { useRouter } from "next/navigation"; // For navigation

import { ButtonIcon } from "../ui/arrowButton";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { apiHelperService } from "@/services/bid";
import CopyButton from "@/components/copybutton";
import { formatID } from "@/utils/common/enum";

interface BidData {
  _id: string; // Assuming your API returns this field for each business
  bid_status: string;
  project_id: string;
  bidder_id: string;
  current_price: string;
  domain_id: string;
}

const BidsTable: React.FC = () => {
  const [bidData, setbidData] = useState<BidData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiHelperService.getAllBid();
        console.log(response.data.data);
        setbidData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  const handleproject = (id: string) => {
    router.push(`/business/tabs?id=${id}`); // Pass the ID as a query parameter
  };
  const handlebidder = (id: string) => {
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
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Project ID</TableHead>
                  <TableHead>Bidder ID</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Domain ID</TableHead>
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
                ) : bidData.length > 0 ? (
                  bidData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Tooltip>
                            <TooltipTrigger>
                              <span>{formatID(user._id)}</span>
                            </TooltipTrigger>

                            <CopyButton id={user._id} />

                            <TooltipContent>
                              {user._id || "No Data Available"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell>{user.bid_status}</TableCell>

                      <TableCell>
                        {user.project_id ? (
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger>
                                <span
                                  onClick={() => handleproject(user.project_id)}
                                  className="cursor-pointer text-blue-500 hover:underline"
                                >
                                  <span>{formatID(user.project_id || "")}</span>
                                </span>
                              </TooltipTrigger>

                              <CopyButton id={user.project_id || ""} />

                              <TooltipContent>
                                {user.project_id || "No Data Available"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          "No Data Available"
                        )}
                      </TableCell>

                      <TableCell>
                        {user.bidder_id ? (
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger>
                                <span
                                  onClick={() => handleproject(user.bidder_id)}
                                  className="cursor-pointer text-blue-500 hover:underline"
                                >
                                  <span>{formatID(user.bidder_id || "")}</span>
                                </span>
                              </TooltipTrigger>

                              <CopyButton id={user.bidder_id || ""} />

                              <TooltipContent>
                                {user.bidder_id || "No Data Available"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          "No Data Available"
                        )}
                      </TableCell>

                      <TableCell>{user.current_price}</TableCell>
                      <TableCell>
                        {user.domain_id ? (
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger>
                                <span>{formatID(user.domain_id || "")}</span>
                              </TooltipTrigger>

                              <CopyButton id={user.domain_id || ""} />

                              <TooltipContent>
                                {user.domain_id || "No Data Available"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          "No Data Available"
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <ButtonIcon />
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Bid Description</DialogTitle>
                              <DialogDescription>
                                {
                                  /*user.description*/ "No Description Available"
                                }
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
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

export default BidsTable;
