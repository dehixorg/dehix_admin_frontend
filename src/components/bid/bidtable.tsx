"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
import { useRouter } from "next/navigation"; // For navigation

import { ButtonIcon } from "../ui/arrowButton";
import { useToast } from "@/components/ui/use-toast";
import { BidstatusEnum, Messages, formatID } from "@/utils/common/enum";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { apiHelperService } from "@/services/bid";
import CopyButton from "@/components/copybutton";
import BidsTableSkeleton from "@/utils/common/skeleton"; // Skeleton component
import { getStatusBadge } from "@/utils/common/utils";

interface BidData {
  _id: string; // Assuming your API returns this field for each bid
  bid_status: BidstatusEnum;
  project_id: string;
  bidder_id: string;
  current_price: string;
  domain_id: string;
}

const BidsTable: React.FC = () => {
  const [bidData, setbidData] = useState<BidData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiHelperService.getAllBid();
        if (response.data.data) {
          setbidData(response.data.data);
        } else {
          toast({
            title: "Error",
            description: Messages.FETCH_ERROR("bid"),
            variant: "destructive", // Red error message
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("bid"),
          variant: "destructive", // Red error message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProject = (id: string) => {
    router.push(`/project/tabs?id=${id}`); // Pass the ID as a query parameter
  };

  const handleBidder = (id: string) => {
    router.push(`/freelancer/tabs?id=${id}`); // Pass the ID as a query parameter
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4 mr-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="table-title">Bid Table</h2>
        </div>
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
                  <BidsTableSkeleton />
                ) : bidData.length > 0 ? (
                  bidData.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Tooltip>
                            <TooltipTrigger>
                              <span>{formatID(user._id)}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {user._id || "No Data Available"}
                            </TooltipContent>
                          </Tooltip>
                          <CopyButton id={user._id} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(user.bid_status)}>
                          {user.bid_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.project_id ? (
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger>
                                <span
                                  onClick={() => handleProject(user.project_id)}
                                  className="cursor-pointer text-blue-500 hover:underline"
                                >
                                  {formatID(user.project_id || "")}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {user.project_id || "No Data Available"}
                              </TooltipContent>
                            </Tooltip>
                            <CopyButton id={user.project_id || ""} />
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
                                  onClick={() => handleBidder(user.bidder_id)}
                                  className="cursor-pointer text-blue-500 hover:underline"
                                >
                                  {formatID(user.bidder_id || "")}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {user.bidder_id || "No Data Available"}
                              </TooltipContent>
                            </Tooltip>
                            <CopyButton id={user.bidder_id || ""} />
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
                              <TooltipContent>
                                {user.domain_id || "No Data Available"}
                              </TooltipContent>
                            </Tooltip>
                            <CopyButton id={user.domain_id || ""} />
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
                                No description available
                              </DialogDescription>
                            </DialogHeader>
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
