import { Github } from "lucide-react";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProfessionalInfo {
  id: string;
  company: string;
  jobTitle: string;
  workDescription: string;
  workFrom: string;
  workTo: string;
  referencePersonName: string;
  referencePersonContact: string;
  githubRepoLink: string;
  oracleAssigned: string;
  verificationStatus: string;
  verificationUpdateTime: string;
  comments: string;
}
type ProfessionalCardProps = React.ComponentProps<typeof Card> & {
  info: ProfessionalInfo;
};

export function ProfessionalCard({ info, ...props }: ProfessionalCardProps) {
  return (
    <Card className={cn("flex flex-col")} {...props}>
      <CardHeader>
        <CardTitle className="text-xl font-bold mb-2">{info.company}</CardTitle>
        <CardDescription className="text-lg font-semibold mb-2">
          {info.jobTitle}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-4 border-b pb-4">
          <p>
            <strong>Work Description:</strong>{" "}
            <span className="text-gray-300">{info.workDescription}</span>
          </p>
          <p>
            <strong>Work From:</strong>{" "}
            <span className="text-gray-300">
              {new Date(info.workFrom).toLocaleDateString()}
            </span>
          </p>
          <p>
            <strong>Work To:</strong>{" "}
            <span className="text-gray-300">
              {new Date(info.workTo).toLocaleDateString()}
            </span>
          </p>
        </div>

        <div className="mb-4">
          <p>
            <strong>Reference Person Name:</strong>{" "}
            <span className="text-gray-300">{info.referencePersonName}</span>
          </p>
          <p>
            <strong>Reference Person Contact:</strong>{" "}
            <span className="text-gray-300">{info.referencePersonContact}</span>
          </p>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Github className="text-blue-500" />
          <p>
            <strong>GitHub Repo Link:</strong>{" "}
            <a
              href={info.githubRepoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              {info.githubRepoLink}
            </a>
          </p>
        </div>

        <div className="mb-4">
          <p>
            <strong>Oracle Assigned:</strong>{" "}
            <span className="text-gray-300">{info.oracleAssigned}</span>
          </p>
          <p>
            <strong>Verification Status:</strong>{" "}
            <span className="text-gray-300">{info.verificationStatus}</span>
          </p>
          <p>
            <strong>Verification Update Time:</strong>{" "}
            <span className="text-gray-300">
              {new Date(info.verificationUpdateTime).toLocaleDateString()}
            </span>
          </p>
        </div>

        <div>
          <p>
            <strong>Comments:</strong>{" "}
            <span className="text-gray-300">{info.comments}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
