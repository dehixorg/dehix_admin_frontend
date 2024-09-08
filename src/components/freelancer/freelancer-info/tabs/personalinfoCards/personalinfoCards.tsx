"use client";
import { Linkedin, Github, Globe } from "lucide-react";

import { cn } from "@/lib/utils";
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

export function UserProfilePage({
  className,
  profile,
  ...props
}: UserProfileProps) {
  return (
    <div className="flex space-x-4 w-full mx-0 px-0">
      {/* Card 1: Personal Information */}
      <Card className="flex-1">
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          {profile ? (
            <>
              <p>
                <strong>First Name:</strong>{" "}
                <span className="text-gray-300">{profile.firstName}</span>
              </p>
              <p>
                <strong>Last Name:</strong>{" "}
                <span className="text-gray-300">{profile.lastName}</span>
              </p>
              <p>
                <strong>User Name:</strong>{" "}
                <span className="text-gray-300">{profile.userName}</span>
              </p>
              <p>
                <strong>Pasword:</strong>{" "}
                <span className="text-gray-300">{profile.password}</span>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <span className="text-gray-300">{profile.email}</span>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <span className="text-gray-300">{profile.phone}</span>
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Card>
      {/* Card 2: Social Links */}

      <Card className="flex-1">
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          {profile ? (
            <>
              <p>
                <strong>Date of Birth:</strong>{" "}
                <span className="text-gray-300">
                  {new Date(profile.dob).toLocaleDateString()}
                </span>
              </p>
              <p>
                <strong>Per Hour Price:</strong>{" "}
                <span className="text-gray-300">{profile.perHourPrice}</span>
              </p>
              <p>
                <strong>Connects:</strong>{" "}
                <span className="text-gray-300">{profile.connects}</span>
              </p>
              <p>
                <strong>Work Experience:</strong>{" "}
                <span className="text-gray-300">{profile.workExperience}</span>
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Card>

      {/* Card 2: Social Links */}

      <Card className="flex-1">
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
                <Github className="mr-2" />
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  GitHub
                </a>
              </p>
              <p className="flex items-center mb-2 ">
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
