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

type EducationCardProps = React.ComponentProps<typeof Card> & {
  education: Education;
};

export function educationCard({
  className,
  education,
  ...props
}: EducationCardProps) {
  return  (
    <Card className={cn("flex flex-col", className)} {...props}>
    <CardHeader>
      <div className="flex items-center justify-between">
      <CardTitle >{education.degree}</CardTitle>
        <Tooltip>
          <TooltipTrigger>
            <span>{getStatusIcon(education.verificationStatus)}</span>
          </TooltipTrigger>
          <TooltipContent>
            <span >{education.verificationStatus}</span>
          </TooltipContent>
        </Tooltip>
        </div>
        <CardDescription>{education.universityName}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Field of Study:</strong> {education.fieldOfStudy}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(education.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(education.endDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Grade:</strong> {education.grade||"No Data Available"}
        </p>
        <p>
          <strong>Comments:</strong> {education.comments||"No Data Available"}
        </p>
      </CardContent>
      <CardFooter>
        <p>
          Updated on:{" "}
          {new Date(education.verificationUpdateTime).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
}
