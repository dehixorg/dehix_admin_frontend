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
  const DataField = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground break-words">{value || "No Data Available"}</span>
    </div>
  );

  const safeHref = (url: string): string | null => {
    if (!url) return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;
    return `https://${trimmed}`;
  };
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const normalized = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
      ? dateString + "T00:00:00"
      : dateString;
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString();
  };

  return (
    <Card className={cn("flex flex-col h-full rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300", className)} {...props}>
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground truncate pl-1 pr-2">
            {data.projectName}
          </CardTitle>
          <Tooltip>
            <TooltipTrigger aria-label={`Status: ${data.verificationStatus}`}>
              <span className="mt-1 block">{getStatusIcon(data.verificationStatus)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>{data.verificationStatus}</span>
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription className="text-sm line-clamp-2 mt-1 px-1">
          {data.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 flex-grow">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <DataField label="Role" value={data.role} />
            <DataField label="Project Type" value={data.projectType} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DataField label="Start Date" value={formatDate(data.start)} />
            <DataField label="End Date" value={formatDate(data.end)} />
          </div>

          <DataField
            label="GitHub Link"
            value={
              safeHref(data.githubLink) ? (
                <a
                  href={safeHref(data.githubLink)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 hover:underline transition-colors"
                >
                  {data.githubLink}
                </a>
              ) : undefined
            }
          />

          <DataField label="Refer" value={data.refer} />

          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Technologies Used</span>
            <div className="flex flex-wrap gap-2">
              {data?.techUsed?.length ? (
                data.techUsed.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="px-2.5 py-0.5 rounded-full font-normal">
                    {tech}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-foreground">No technologies listed</span>
              )}
            </div>
          </div>

          {data.comments && (
            <DataField label="Comments" value={data.comments} />
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t text-xs text-muted-foreground bg-muted/20 rounded-b-xl">
        Updated on: {formatDate(data.verificationUpdateTime) || "Unknown"}
      </CardFooter>
    </Card>
  );
}
