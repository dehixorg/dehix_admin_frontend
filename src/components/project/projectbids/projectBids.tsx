"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  DollarSign,
  User,
  Info,
  Calendar,
  PackageOpen,
  Fingerprint,
  CopyIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { apiHelperService } from "@/services/business";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

// Interface for a single bid object, based on the provided image
interface Bid {
  bid_status: string;
  bidder_id: string;
  createdAt: string;
  current_price: number;
  description: string;
  profile_id: string;
  project_id: string;
  updatedAt: string;
  userName: string;
  _id: string;
}

type ProjectBidsProps = React.ComponentProps<typeof Card> & {
  id: string;
};

// Reusable CopyButton component
const CopyButton = ({ id }: { id: string }) => {
  const { toast } = useToast();
  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Copied!",
      description: "ID has been copied to your clipboard.",
      duration: 2000,
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            className="ml-2 text-muted-foreground hover:text-primary"
            aria-label="Copy ID"
          >
            <CopyIcon className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy ID</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};


export function ProjectBids({ id, ...props }: ProjectBidsProps) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchBidsData = async () => {
      setLoading(true);
      setError(null);
      setBids([]);
      try {
        const response = await apiHelperService.getBusinessProjectbyId(id);

        if (response?.data?.data && response.data.data.length > 0) {
          setBids(response.data.data[0].bids || []);
        } else {
          setError("No project data found for this ID.");
        }
      } catch (err) {
        console.error("Error fetching bids data:", err);
        setError("Failed to fetch bids data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBidsData();
  }, [id]);

  if (loading) {
    return <p>Loading bids...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {status}
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {status}
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="hover:bg-gray-200">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-semibold pb-6 tracking-tight">Profile Bids</h2>

      {bids.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bids.map((bid) => (
            <Card key={bid._id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="bg-muted/50 p-4 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <CardTitle className="text-lg font-bold flex items-center mb-1">
                      <User className="mr-2 h-5 w-5 text-primary" />
                      {bid.userName}
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      Bid placed on: {new Date(bid.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {getStatusBadge(bid.bid_status)}
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-1 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">{bid.current_price}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <Info className="mr-2 h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
                    <p className="text-sm text-gray-700">{bid.description}</p>
                  </div>
                </div>

                <div className="pt-2 border-t text-sm text-muted-foreground space-y-1">
                 <div className="flex items-center group">
  <Fingerprint className="h-4 w-4 mr-2" />
  <Link
    href={{
      pathname: '/freelancer/tabs',
      query: { id: bid.bidder_id },
    }}
    className="flex items-center text-primary hover:underline"
  >
    <span>Bidder ID: {bid.bidder_id}</span>
  </Link>
  <CopyButton id={bid.bidder_id} />
</div>
                  <div className="flex items-center group">
                    <Fingerprint className="h-4 w-4 mr-2" />
                      <span>Project ID: {bid.project_id}</span>
                    <CopyButton id={bid.project_id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 w-full mt-10">
          <PackageOpen className="mx-auto text-gray-500" size={100} />
          <p className="text-gray-500">No bids have been placed for this project yet.</p>
        </div>
      )}
    </div>
  );
}