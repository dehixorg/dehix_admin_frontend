"use client";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SkillItem {
  _id: string;
  name: string;
  level: string;
  experience: string;
  skillId: string;
}

interface SkillCardProps {
  data: SkillItem;
}

const SkillCard: React.FC<SkillCardProps> = ({ data }) => {
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
          <span className="text-sm font-medium">Skill ID:</span>
          <span className="text-sm text-muted-foreground">{data.skillId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Level:</span>
          <Badge variant="secondary">{data.level}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Experience:</span>
          <Badge variant="secondary">{data.experience}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillCard;