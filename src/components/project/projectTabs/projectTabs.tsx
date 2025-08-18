import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  Star,
  DollarSign,
  Info,
  Earth,
  Code,
  CircleMinus,
  Dot,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiHelperService } from "@/services/business";

interface ProjectTabsProps {
  id: string;
}

interface Profile {
  domain: string;
  freelancersRequired: string;
  skills: string[];
  experience: number;
  minConnect: number;
  rate: number;
  description: string;
  _id: string;
}

interface UserData {
  profiles: Profile[];
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ id }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      setUserData(null);
      try {
        const response = await apiHelperService.getBusinessProjectbyId(id);
        
        // Check if the data array exists and has at least one element
        if (response?.data?.data && response.data.data.length > 0) {
          // Set userData to the first object in the array
          setUserData(response.data.data[0]);
        } else {
          console.error("User data is missing or null");
          setError("No project data found.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch project data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Use a more robust check before rendering
  if (!userData || !userData.profiles || userData.profiles.length === 0) {
    return <p>No profiles found.</p>;
  }

  return (
    <Tabs defaultValue={userData.profiles[0].domain}>
      <TabsList className="grid w-full grid-cols-4 min-w-[400px] overflow-x-auto no-scrollbar">
        {userData.profiles.map((profile) => (
          <TabsTrigger key={profile._id} value={profile.domain}>
            {profile.domain}
          </TabsTrigger>
        ))}
      </TabsList>

      {userData.profiles.map((profile) => (
        <TabsContent key={profile._id} value={profile.domain}>
          <Card>
            <CardHeader>
              <CardTitle className="mb-3 flex items-center">
                <Briefcase className="mr-2 w-6 h-6 text-gray-500" />
                <span className="uppercase">{profile.domain} Profile</span>
              </CardTitle>
              <CardDescription className="flex items-center">
                <Dot className="mr-2 w-5 h-5 text-gray-500" />
                {profile._id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <Earth className="mr-2 w-5 h-5 text-gray-500" />
                <strong className="mr-2">Domain:</strong> {profile.domain}
              </div>
              <div className="flex items-center">
                <Users className="mr-2 w-5 h-5 text-gray-500" />
                <strong className="mr-2">Freelancers Required:</strong>{" "}
                {profile.freelancersRequired}
              </div>
              {/* Added a check here to prevent an error if skills array is null/empty */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="flex items-center">
                  <Code className="mr-2 w-5 h-5 text-gray-500" />
                  <strong className="mr-2">Skills:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} className="px-3 py-1 rounded-full">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <Star className="mr-2 w-5 h-5 text-gray-500" />
                <strong className="mr-2">Experience (Years):</strong>{" "}
                {profile.experience}
              </div>
              <div className="flex items-center">
                <CircleMinus className="mr-2 w-5 h-5 text-gray-500" />
                <strong>Minimum Connects:</strong> {profile.minConnect}
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 w-5 h-5 text-gray-500" />
                <strong className="mr-2">Rate:</strong> ${profile.rate}
              </div>
              <div className="flex items-center">
                <Info className="mr-2 w-5 h-5 text-gray-500" />
                <strong className="mr-2">Description:</strong>{" "}
                {profile.description}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProjectTabs;