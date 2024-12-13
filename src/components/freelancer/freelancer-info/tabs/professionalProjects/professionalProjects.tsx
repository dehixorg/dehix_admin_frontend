import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { getStatusIcon } from "@/utils/common/utils";

interface PersonalProjects {
  _id: string;
  projectName: string;
  description: string;
  verified: boolean;
  githubLink: string;
  start: string; // ISO date string
  end: string; // ISO date string
  refer: string;
  techUsed: string[];
  role: string;
  projectType: string;
  oracleAssigned: string;
  verificationStatus: "added" | "verified" | "reapplied";
  verificationUpdateTime: string; // ISO date string
  comments: string;
}

type projectsCardProps = React.ComponentProps<typeof Card> & {
 data: PersonalProjects;
};

export function projectsCard({
  className,
  data,
  ...props
}: projectsCardProps) {
  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="h-12 overflow-hidden text-ellipsis">
          {data.projectName}
        </CardTitle>
        <Tooltip>
          <TooltipTrigger>
            <span>{getStatusIcon(data.verificationStatus)}</span>
          </TooltipTrigger>
          <TooltipContent>
            <span >{data.verificationStatus}</span>
          </TooltipContent>
        </Tooltip>
        </div>
        <CardDescription className="h-10 overflow-hidden text-ellipsis">
          {data.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Role:</strong> {data.role}
        </p>
        <p>
          <strong>Project Type:</strong> {data.projectType}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(data.start).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(data.end).toLocaleDateString()}
        </p>
        <p>
          <strong>GitHub Link:</strong>{" "}
          <a
            href={data.githubLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.githubLink}
          </a>
        </p>
        <p>
          <strong>Refer:</strong> {data.refer}
        </p>
        <p>
          <strong>Technologies Used:</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          {data?.techUsed?.length ? (
            data.techUsed.map((tech, index) => (
              <Badge key={index} className="mr-1">
                {tech}
              </Badge>
            ))
          ) : (
            <p>No technologies listed.</p>
          )}
        </div>
        <p>
          <strong>Comments:</strong> {data.comments}
        </p>
      </CardContent>
      <CardFooter>
        <p>
          Updated on:{" "}
          {new Date(data.verificationUpdateTime).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
}
