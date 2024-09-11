import React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// TypeScript interface for DehixTalentInfo
interface DehixTalentInfo {
  skillName: string;
  domainName: string;
  status: string;
  activestatus: string;
  price: string | number;
  link: string;
}

type DehixTalentCardProps = React.ComponentProps<typeof Card> & {
  info: DehixTalentInfo;
};

export function Talentcard({ info, ...props }: DehixTalentCardProps) {
  return (
    <Card className={cn("flex flex-col")} {...props}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Dehix Talent Info</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex ">
          <p className="text-md font-semibold">Skill Name: </p>
          <p className="text-gray-300 ml-2">{info.skillName}</p>
        </div>

        <div className="flex ">
          <p className="text-md font-semibold">Domain Name: </p>
          <p className="text-gray-300 ml-2">{info.domainName}</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex ">
            <p className="text-md font-semibold">Status: </p>

            <Badge className="ml-2">{info.status}</Badge>
          </div>

          <div className="flex ">
            <p className="text-md font-semibold">Active Status: </p>
            <Badge className="ml-2">{info.activestatus}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
