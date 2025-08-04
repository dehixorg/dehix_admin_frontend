"use client";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DomainItem {
  _id: string;
  name: string;
  level: string;
  experience: string;
  interviewInfo: string;
  interviewStatus: string;
  interviewerRating: number;
}

interface DomainCardProps {
  data: DomainItem;
}

const DomainCard: React.FC<DomainCardProps> = ({ data }) => {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-xl">{data.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">ID:</span>
          <span className="text-sm text-muted-foreground">{data._id}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Level:</span>
          <Badge variant="secondary">{data.level}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Experience:</span>
          <Badge variant="secondary">{data.experience}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Interview Status:</span>
          <Badge variant="outline">{data.interviewStatus}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Interview Info:</span>
          <p className="text-sm text-muted-foreground">{data.interviewInfo}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Interviewer Rating:</span>
          <Badge variant="default">{data.interviewerRating}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainCard;