import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { getStatusIcon } from "@/utils/common/utils";

interface Education {
  __id: string;
  degree: string;
  universityName: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
  oracleAssigned: string;
  verificationStatus: string;
  verificationUpdateTime: string;
  comments: string;
}

type EducationCardProps = {
  data: Education; // Updated to match the generic `renderDataSection`
};

export function educationCard({ data }: EducationCardProps) {
  return (
    <Card className={cn("flex flex-col")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{data.degree}</CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <span>{getStatusIcon(data.verificationStatus)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>{data.verificationStatus}</span>
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription>{data.universityName}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Field of Study:</strong> {data.fieldOfStudy}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(data.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(data.endDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Grade:</strong> {data.grade || "No Data Available"}
        </p>
        <p>
          <strong>Comments:</strong> {data.comments || "No Data Available"}
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
