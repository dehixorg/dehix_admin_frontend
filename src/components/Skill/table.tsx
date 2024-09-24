"use client";
import * as React from "react";
import { useState } from "react";
import { PackageOpen, Eye, Trash2 } from "lucide-react";

import AddSkill from "./form";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SkillData {
  id: string;
  skill: string;
  description: string;
}

const SkillTable: React.FC = () => {
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [open, setOpen] = useState(false);
  const [newSkill, setNewSkill] = useState<SkillData>({
    id: "",
    skill: "",
    description: "",
  });

  const handleDelete = (skillId: string) => {
    setSkills((prevSkills) =>
      prevSkills.filter((skill) => skill.id !== skillId),
    );
  };

  const handleAddSkill = () => {
    setSkills((prevSkills) => [
      ...prevSkills,
      { ...newSkill, id: (skills.length + 1).toString() },
    ]);
    setNewSkill({ id: "", skill: "", description: "" });
    setOpen(false);
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <div className="flex items-center justify-between mb-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(true)}>Add Skill</Button>
            </DialogTrigger>
            <DialogContent>
              <AddSkill
                newSkill={newSkill}
                setNewSkill={setNewSkill}
                handleAddSkill={handleAddSkill}
              />
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell>{skill.skill}</TableCell>
                      <TableCell>{skill.description}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="p-4">
                            <DialogHeader>
                              <DialogTitle>Skill Details</DialogTitle>
                              <DialogDescription>
                                Detailed information about the skill.
                              </DialogDescription>
                            </DialogHeader>
                            <div>
                              <p>
                                <strong>Skill:</strong> {skill.skill}
                              </p>
                              <p>
                                <strong>Description:</strong>{" "}
                                {skill.description}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <Trash2
                          className="cursor-pointer text-gray-500 hover:text-red-500"
                          onClick={() => handleDelete(skill.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen
                          className="mx-auto text-gray-500"
                          size="100"
                        />
                        <p className="text-gray-500">
                          No skills available.
                          <br /> Add some skills to get started.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SkillTable;
