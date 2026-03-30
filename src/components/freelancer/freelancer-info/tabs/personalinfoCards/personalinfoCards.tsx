"use client";
import { Linkedin, GitPullRequest, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

interface UserProfile {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
  phone: string;
  dob: string;
  linkedin: string;
  github: string;
  personalWebsite: string;
  perHourPrice: string;
  connects: string;
  workExperience: string;
}

type UserProfileProps = React.ComponentProps<typeof Card> & {
  profile: UserProfile;
};

export function UserProfilePage({ className, profile, ...props }: UserProfileProps) {
  if (!profile) return null;

  const DataField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-base text-foreground break-words">{value || "No Data Available"}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {/* Card 1: Personal Information */}
      <Card className="h-full rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-6 text-foreground border-b pb-3">Personal Information</h2>
          <div className="grid gap-4">
            <DataField label="First Name" value={profile.firstName} />
            <DataField label="Last Name" value={profile.lastName} />
            <DataField label="User Name" value={profile.userName} />
            <DataField label="Email" value={profile.email} />
            <DataField label="Phone" value={profile.phone} />
          </div>
        </div>
      </Card>

      {/* Card 2: Additional Information */}
      <Card className="h-full rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-6 text-foreground border-b pb-3">Additional Information</h2>
          <div className="grid gap-4">
            <DataField
              label="Date of Birth"
              value={profile.dob && !isNaN(Date.parse(profile.dob))
                ? new Date(profile.dob).toLocaleDateString()
                : ""}
            />            <DataField label="Per Hour Price" value={profile.perHourPrice} />
            <DataField label="Connects" value={profile.connects} />
            <DataField label="Work Experience" value={profile.workExperience} />
          </div>
        </div>
      </Card>

      {/* Card 3: Social Links */}
      <Card className="h-full rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-6 text-foreground border-b pb-3">Social Links</h2>
          <div className="grid gap-4">
            {profile.linkedin ? (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-lg border bg-card hover:bg-muted transition-colors cursor-pointer group"
              >
                <Linkedin className="mr-3 h-5 w-5 text-blue-600 dark:text-blue-500 group-hover:text-blue-700 transition-colors" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">LinkedIn</span>
                  <span className="text-xs text-muted-foreground truncate w-48">View Profile</span>
                </div>
              </a>
            ) : (
              <div className="flex items-center p-3 rounded-lg border bg-card opacity-60">
                <Linkedin className="mr-3 h-5 w-5 text-blue-600 dark:text-blue-500 group-hover:text-blue-700 transition-colors" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">LinkedIn</span>
                  <span className="text-xs text-muted-foreground truncate w-48">Not Provided</span>
                </div>
              </div>
            )}
            {profile.github ? (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-lg border bg-card hover:bg-muted transition-colors cursor-pointer group"
              >
                <GitPullRequest className="mr-3 h-5 w-5 text-gray-800 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">GitHub</span>
                  <span className="text-xs text-muted-foreground truncate w-48">View Profile</span>
                </div>
              </a>
            ) : (
              <div className="flex items-center p-3 rounded-lg border bg-card opacity-60">
                <GitPullRequest className="mr-3 h-5 w-5 text-gray-800 dark:text-gray-300 transition-colors" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">GitHub</span>
                  <span className="text-xs text-muted-foreground truncate w-48">Not Provided</span>
                </div>
              </div>
            )}

            {profile.personalWebsite ? (
              <a
                href={profile.personalWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-lg border bg-card hover:bg-muted transition-colors cursor-pointer group"
              >
                <Globe className="mr-3 h-5 w-5 text-emerald-600 dark:text-emerald-500 group-hover:text-emerald-700 transition-colors" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Personal Website</span>
                  <span className="text-xs text-muted-foreground truncate w-48">Visit Website</span>
                </div>
              </a>
            ) : (
              <div className="flex items-center p-3 rounded-lg border bg-card opacity-60">
                <Globe className="mr-3 h-5 w-5 text-emerald-600 dark:text-emerald-500 transition-colors" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Personal Website</span>
                  <span className="text-xs text-muted-foreground truncate w-48">Not Provided</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}