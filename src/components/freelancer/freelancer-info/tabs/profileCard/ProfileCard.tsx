// src/components/Profile/ProfileCard.tsx

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const safeHref = (url?: string): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;
  return `https://${trimmed}`;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ data }) => {
  return (
    <Card className="flex flex-col h-full rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-lg font-semibold text-foreground">{data.profileName}</CardTitle>
        <CardDescription className="text-sm mt-1">{data.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pt-5">
        <div className="space-y-5">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Hourly Rate</span>
            <span className="text-base font-semibold text-foreground">${data.hourlyRate} / hr</span>
          </div>

          {(safeHref(data.githubLink) || safeHref(data.linkedinLink) || safeHref(data.personalWebsite)) && (
            <div className="flex items-center space-x-3 pt-2">
              {safeHref(data.githubLink) && (
                <a href={safeHref(data.githubLink)!} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="p-2 bg-muted rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Github className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </a>
              )}
              {safeHref(data.linkedinLink) && (
                <a href={safeHref(data.linkedinLink)!} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="p-2 bg-muted rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                  <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </a>
              )}
              {safeHref(data.personalWebsite) && (
                <a href={safeHref(data.personalWebsite)!} target="_blank" rel="noopener noreferrer" aria-label="Personal website" className="p-2 bg-muted rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
                  <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                </a>
              )}            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;