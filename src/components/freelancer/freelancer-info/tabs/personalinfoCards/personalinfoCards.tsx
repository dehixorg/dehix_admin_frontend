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

export function UserProfilePage({ profile }: UserProfileProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full p-4">
      {/* Card 1: Personal Information */}
      <Card className="h-full">
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          {profile ? (
            <>
              <p>
                <strong>First Name:</strong> {profile.firstName || "No Data Available"}
              </p>
              <p>
                <strong>Last Name:</strong> {profile.lastName || "No Data Available"}
              </p>
              <p>
                <strong>User Name:</strong> {profile.userName || "No Data Available"}
              </p>
              <p>
                <strong>Email:</strong> {profile.email || "No Data Available"}
              </p>
              <p>
                <strong>Phone:</strong> {profile.phone || "No Data Available"}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Card>

      {/* Card 2: Additional Information */}
      <Card className="h-full">
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
          {profile ? (
            <>
              <p>
                <strong>Date of Birth:</strong> {profile.dob ? new Date(profile.dob).toLocaleDateString() : "No Data Available"}
              </p>
              <p>
                <strong>Per Hour Price:</strong> {profile.perHourPrice || "No Data Available"}
              </p>
              <p>
                <strong>Connects:</strong> {profile.connects || "No Data Available"}
              </p>
              <p>
                <strong>Work Experience:</strong> {profile.workExperience || "No Data Available"}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Card>

      {/* Card 3: Social Links */}
      <Card className="h-full">
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Social Links</h2>
          {profile ? (
            <>
              <p className="flex items-center mb-2">
                <Linkedin className="mr-2" />
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  LinkedIn
                </a>
              </p>
              <p className="flex items-center mb-2">
                <GitPullRequest className="mr-2" />
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  GitHub
                </a>
              </p>
              <p className="flex items-center mb-2">
                <Globe className="mr-2" />
                <a
                  href={profile.personalWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Personal Website
                </a>
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Card>
    </div>
  );
}