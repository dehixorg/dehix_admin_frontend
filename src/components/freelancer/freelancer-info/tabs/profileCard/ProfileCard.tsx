// src/components/Profile/ProfileCard.tsx

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Github, Linkedin, Globe } from "lucide-react";

interface ProfileData {
  _id: string;
  profileName: string;
  description: string;
  hourlyRate: number;
  githubLink?: string;
  linkedinLink?: string;
  personalWebsite?: string;
  // ... other fields from your profile object
}

interface ProfileCardProps {
  data: ProfileData;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ data }) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{data.profileName}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              Hourly Rate: ${data.hourlyRate}
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            {data.githubLink && (
              <Link href={data.githubLink} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" />
              </Link>
            )}
            {data.linkedinLink && (
              <Link href={data.linkedinLink} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200" />
              </Link>
            )}
            {data.personalWebsite && (
              <Link href={data.personalWebsite} target="_blank" rel="noopener noreferrer">
                <Globe className="h-5 w-5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" />
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;