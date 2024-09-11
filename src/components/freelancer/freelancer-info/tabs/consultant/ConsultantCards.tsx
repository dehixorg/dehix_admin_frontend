import React from "react";
import { Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// TypeScript interface for DehixTalentInfo
interface ConsultantInfo {
  description: string;
  experience: string;
  price: string;
  status: string;
  consultantDescription: string;
  _id: string;
  links?: string[];
}

type ConsultantCardsProps = React.ComponentProps<typeof Card> & {
  info: ConsultantInfo;
};

export function ConsultantCards({ info, ...props }: ConsultantCardsProps) {
  return (
    <Card className={cn("flex flex-col")} {...props}>
      <CardHeader className=" text-lg font-semibold">
        {info.description}
      </CardHeader>

      <CardContent>
        <CardDescription>{info._id}</CardDescription>
        <div className="flex">
          <p className="text-md font-semibold">Status:</p>
          <Badge className="ml-2">{info.status}</Badge>
        </div>

        <div className="flex">
          <p className="text-md font-semibold">Price:</p>
          <p className=" ml-2">{info.price}</p>
        </div>
        <div className="flex">
          <p className="text-md font-semibold">experience:</p>
          <p className="ml-2">{info.experience}</p>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex items-center">
          <Globe className="mr-2" />
          <p className="text-md font-semibold mr-2">Links:</p>
        </div>
        <div className="flex flex-col gap-1">
          {info.links && info.links.length > 0 ? (
            info.links.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                {url}
              </a>
            ))
          ) : (
            <p className="text-gray-500">No links available.</p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
