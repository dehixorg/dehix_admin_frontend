'use client'
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { axiosInstance } from "@/lib/axiosinstance";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

interface SkillData {
  _id: string;
  label: string;
  description: string;
  createdAt?: string; // Optional fields
  createdBy?: string;
  status?: string;
}

interface Skill {
  _id: string;
  label: string;
  description: string;
}

interface AddSkillProps {
  onAddSkill: (newSkill: SkillData) => void; // Prop to pass the new Skill
}

// Zod schema for form validation
const SkillSchema = z.object({
  label: z.string().nonempty("Please enter a Skill name"),
  description: z.string().nonempty("Please enter a description"),
  status: z.enum(["Active"]).default("Active"),
});

const AddSkill: React.FC<AddSkillProps> = ({ onAddSkill }) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [Skills, setSkills] = useState<Skill[]>([]); // Use Skill type here
  const currentUserId = "user-id-123";
  //const currentUserId = useSelector((state: RootState) => state.user);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SkillData>({
    resolver: zodResolver(SkillSchema),
    defaultValues: {
      label: "",
      description: "",
      status: "Active",
    },
  });

  // Fetch the list of Skills from the backend
  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await axiosInstance.get("/skills/all");
        setSkills(response.data.data);
      } catch (error) {
        console.error("Error fetching Skills:", error);
      }
    }

    fetchSkills();
  }, []);

  // Handle form submission to add a new Skill
  const onSubmit = async (data: SkillData) => {
    // Check if Skill already exists
    const isSkillExist = Skills.some(
      (Skill) => Skill.label.toLowerCase() === data.label.toLowerCase(),
    );

    if (isSkillExist) {
      setErrorMessage(`The Skill "${data.label}" already exists.`);
      return;
    }

    try {
      // Post the new Skill to the backend
      const skillDataWithUser = { ...data, createdBy: currentUserId };
      const response = await axiosInstance.post(`/skills/createskill`, skillDataWithUser);
      const newSkill = response.data.data;

      // Pass the new Skill to the parent component
      onAddSkill(newSkill);

      // Reset the form and show success message
      setSuccessMessage("Skill added successfully!");
      reset();
      setErrorMessage(null); // Clear any previous error message

      // Close the dialog after a short delay
      setTimeout(() => {
        setOpen(false);
        setSuccessMessage(null);
      }, 500);
    } catch (error) {
      console.error("Error submitting Skill:", error);
      setErrorMessage("Failed to add the Skill. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Skill</DialogTitle>
          <DialogDescription>Enter the Skill details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <Controller
              control={control}
              name="label"
              render={({ field }) => (
                <Input
                  placeholder="Enter Skill name"
                  {...field}
                  className="border p-2 rounded w-full"
                />
              )}
            />
            {errors.label && (
              <p className="text-red-600">{errors.label.message}</p>
            )}
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  placeholder="Description"
                  {...field}
                  className="border p-2 rounded mt-2 w-full h-[130px]"
                />
              )}
            />

            {errors.description && (
              <p className="text-red-600">{errors.description.message}</p>
            )}
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">InActive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {errorMessage && (
            <p className="text-red-600 mb-3">{errorMessage}</p> // Error message for duplicates
          )}
          {successMessage && (
            <p className="text-green-600 mb-3">{successMessage}</p> // Success message
          )}
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkill;
