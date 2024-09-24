import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { axiosInstance } from "@/lib/axiosinstance";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface SkillData {
  skill: string;
  description: string;
}

interface AddSkillFormProps {
  newSkill: { id: string; skill: string; description: string };
  setNewSkill: React.Dispatch<
    React.SetStateAction<{ id: string; skill: string; description: string }>
  >;
  handleAddSkill: () => void;
}

const skillSchema = z.object({
  skill: z.string().nonempty("Please enter a skill"),
  description: z.string().nonempty("Please enter a description"),
});

const AddSkillForm: React.FC<AddSkillFormProps> = ({
  newSkill,
  setNewSkill,
  handleAddSkill,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SkillData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skill: "",
      description: "",
    },
  });

  const [skills, setSkills] = useState<{ label: string }[]>([]);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await axiosInstance.get("/skills/all");
        setSkills(response.data.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    }

    fetchSkills();
  }, []);

  const onSubmit = async (data: SkillData) => {
    try {
      await axiosInstance.post(`/skills/createskill`, data);
      reset();
      handleAddSkill();
    } catch (error) {
      console.error("Error submitting skill:", error);
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Add Skill</DialogTitle>
        <DialogDescription>
          Enter the skill and description below.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Controller
            name="skill"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setNewSkill({ ...newSkill, skill: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  {skills.map((skill, index) => (
                    <SelectItem
                      key={skill.label || `skill-${index}`}
                      value={skill.label}
                    >
                      {skill.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.skill && (
            <p className="text-red-500">{errors.skill.message}</p>
          )}
        </div>
        <div className="mb-3">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Description"
                className="border p-2 rounded mt-2 w-full"
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setNewSkill({ ...newSkill, description: e.target.value });
                }}
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full">
            Add Skill
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
};

export default AddSkillForm;
