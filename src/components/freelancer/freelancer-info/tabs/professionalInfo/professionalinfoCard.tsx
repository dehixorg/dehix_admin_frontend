import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { getStatusIcon } from "@/utils/common/utils";
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
  data: ProfessionalInfo;
};

export function ProfessionalCard({ data, ...props }: ProfessionalCardProps) {
  return (
    <Card className={cn("flex flex-col")} {...props}>
      <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl font-bold mb-2">{data.company}</CardTitle>
        <Tooltip>
          <TooltipTrigger>
            <span>{getStatusIcon(data.verificationStatus)}</span>
          </TooltipTrigger>
          <TooltipContent>
            <span >{data.verificationStatus}</span>
          </TooltipContent>
        </Tooltip>
        </div>

        <CardDescription className="text-lg font-semibold mb-2">
          {data.jobTitle}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-4 border-b pb-4">
          <p>
            <strong>Work Description:</strong> {data.workDescription}
          </p>
          <p>
            <strong>Work From:</strong>
            {new Date(data.workFrom).toLocaleDateString()}
          </p>
          <p>
            <strong>Work To:</strong>
            {new Date(data.workTo).toLocaleDateString()}
          </p>
        </div>

        <div className="mb-4">
          <p>
            <strong>Reference Person Name:</strong> {data.referencePersonName}
          </p>
          <p>
            <strong>Reference Person Contact:</strong>{" "}
            {data.referencePersonContact}
          </p>
        </div>

        <div className="mb-4 flex items-center gap-2">
         
          <p>
            <strong>GitHub Repo Link:</strong>{" "}
            <a
              href={data.githubRepoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              {data.githubRepoLink}
            </a>
          </p>
        </div>

        <div className="mb-4">
          <p>
            <strong>Oracle Assigned:</strong>{" "}
            <span className="text-gray-300">{data.oracleAssigned}</span>
          </p>
          <p>
            <strong>Verification Update Time:</strong>{" "}
            {new Date(data.verificationUpdateTime).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p>
            <strong>Comments:</strong> {data.comments}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
