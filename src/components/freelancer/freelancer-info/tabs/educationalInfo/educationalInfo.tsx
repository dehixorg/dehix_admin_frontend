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
  const DataField = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground break-words">{value || "No Data Available"}</span>
    </div>
  );

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString();
  };

  return (
    <Card className={cn("flex flex-col h-full rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300")}>
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">{data.degree}</CardTitle>
          <Tooltip>
            <TooltipTrigger>
              <span className="mt-1 block">{getStatusIcon(data.verificationStatus)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>{data.verificationStatus}</span>
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription className="text-sm mt-1">{data.universityName}</CardDescription>
      </CardHeader>
      <CardContent className="pt-5 flex-grow">
        <div className="grid gap-4">
          <DataField label="Field of Study" value={data.fieldOfStudy} />

          <div className="grid grid-cols-2 gap-4">
            <DataField label="Start Date" value={formatDate(data.startDate)} />
            <DataField label="End Date" value={formatDate(data.endDate)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DataField label="Grade" value={data.grade} />
          </div>

          <DataField label="Comments" value={data.comments} />
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t text-xs text-muted-foreground bg-muted/20 rounded-b-xl">
        Updated on: {new Date(data.verificationUpdateTime).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
}
