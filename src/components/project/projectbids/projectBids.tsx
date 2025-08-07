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
  HardHat,
  Tag,
  Code,
  Star,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { apiHelperService } from "@/services/business";
import { apiHelperService as BidsapiHelperService } from "@/services/bid";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

// Interface for a single bid object
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

// Updated interface for a profile object based on your image
// The 'userName' field has been removed as per your request
interface Profile {
  _id: string;
  domain: string;
  description: string;
  skills: string[];
  experience: number;
}

// New interface to hold the profile and its bid together
interface ProfileWithBid {
  profile: Profile;
  bid: Bid | null;
}

// Reusable CopyButton component (unchanged)
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

type ProjectBidsProps = React.ComponentProps<typeof Card> & {
  id: string;
};

export function ProjectBids({ id, ...props }: ProjectBidsProps) {
  const [profilesWithBids, setProfilesWithBids] = useState<ProfileWithBid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchBidsForProfiles = async () => {
      setLoading(true);
      setError(null);
      setProfilesWithBids([]);

      try {
        const response = await apiHelperService.getBusinessProjectbyId(id);
        const projectData = response?.data?.data?.[0];

        if (!projectData) {
          setError("No project data found for this ID.");
          setLoading(false);
          return;
        }

        const profiles: Profile[] = projectData.profiles || [];

        if (profiles.length > 0) {
          const fetchedData = await Promise.all(
            profiles.map(async (profile) => {
              try {
                const bidResponse = await BidsapiHelperService.getBidByProjectAndProfileId({
                  projectId: id,
                  profileId: profile._id,
                });
                const bidData = bidResponse?.data?.data?.[0] || null;
                return { profile, bid: bidData };
              } catch (err) {
                console.error(`Failed to fetch bid for profile ${profile._id}:`, err);
                return { profile, bid: null };
              }
            })
            
          );
          console.log(fetchedData)
          setProfilesWithBids(fetchedData);
        }
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError("Failed to fetch project or bids data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBidsForProfiles();
  }, [id]);

  const getStatusBadge = (status: string | undefined) => {
    if (!status) {
      return (
        <Badge variant="secondary" className="hover:bg-gray-200">
          No Bid Placed
        </Badge>
      );
    }
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

  if (loading) {
    return <p>Loading profiles and bids...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-semibold pb-6 tracking-tight">Project Bids by Profile</h2>
      {profilesWithBids.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profilesWithBids.map(({ profile, bid }) => (
            <Card key={profile._id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="bg-muted/50 p-4 rounded-t-lg border-b">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <CardTitle className="text-lg font-bold flex items-center mb-1">
                      <HardHat className="mr-2 h-5 w-5 text-indigo-600" />
                      Freelancer Profile
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                      {profile.domain}
                    </CardDescription>
                  </div>
                  {getStatusBadge(bid?.bid_status)}
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-md font-semibold flex items-center text-gray-800">
                    <Info className="mr-2 h-4 w-4 text-gray-600" />
                    Profile Description
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {profile.description || "No profile description available."}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center text-gray-800">
                    <Code className="mr-2 h-4 w-4 text-gray-600" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="hover:bg-gray-200">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No skills listed.</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-700">
                    Experience: {profile.experience} years
                  </span>
                </div>
                <hr className="my-2" />
                {bid ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Bid Price</p>
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-1 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">{bid.current_price}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-md font-semibold flex items-center text-gray-800">
                        <Tag className="mr-2 h-4 w-4 text-gray-600" />
                        Bid Description
                      </h3>
                      <p className="text-sm text-gray-700">
                        {bid.description}
                      </p>
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
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">This profile has not placed a bid yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 w-full mt-10">
          <PackageOpen className="mx-auto text-gray-500" size={100} />
          <p className="text-gray-500">
            No profiles are associated with this project, or no bids have been placed yet.
          </p>
        </div>
      )}
    </div>
  );
}