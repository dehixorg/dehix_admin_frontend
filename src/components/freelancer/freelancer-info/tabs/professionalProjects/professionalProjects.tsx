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
interface Projects {
  [key: string]: PersonalProjects;
}

type projectsCardProps = React.ComponentProps<typeof Card> & {
  projects: PersonalProjects;
};

export function projectsCard({
  className,
  projects,
  ...props
}: projectsCardProps) {
  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader>
        <CardTitle className="h-12 overflow-hidden text-ellipsis">
          {projects.projectName}
        </CardTitle>
        <CardDescription className="h-10 overflow-hidden text-ellipsis">
          {projects.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Role:</strong> {projects.role}
        </p>
        <p>
          <strong>Project Type:</strong> {projects.projectType}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(projects.start).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(projects.end).toLocaleDateString()}
        </p>
        <p>
          <strong>GitHub Link:</strong>{" "}
          <a
            href={projects.githubLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {projects.githubLink}
          </a>
        </p>
        <p>
          <strong>Refer:</strong> {projects.refer}
        </p>
        <p>
          <strong>Technologies Used:</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          {projects?.techUsed?.length ? (
            projects.techUsed.map((tech, index) => (
              <Badge key={index} className="mr-1">
                {tech}
              </Badge>
            ))
          ) : (
            <p>No technologies listed.</p>
          )}
        </div>
        <p>
          <strong>Verification Status:</strong> {projects.verificationStatus}
        </p>
        <p>
          <strong>Comments:</strong> {projects.comments}
        </p>
      </CardContent>
      <CardFooter>
        <p>
          Updated on:{" "}
          {new Date(projects.verificationUpdateTime).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
}
