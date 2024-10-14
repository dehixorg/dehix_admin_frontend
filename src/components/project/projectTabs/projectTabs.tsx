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

const ProjectTabs: React.FC<ProjectTabsProps> = ({ id }) => {
  const [userData, setUserData] = useState<{ profiles: Profile[] } | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiHelperService.getAllBusinessProject(id);
        if (response?.data?.data?.data) {
          setUserData(response.data.data.data);
        } else {
          console.error("User data is missing or null");
          setUserData(null); // or handle with a default value
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData || userData.profiles.length === 0) {
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
