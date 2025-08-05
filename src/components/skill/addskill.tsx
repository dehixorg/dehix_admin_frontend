"use client";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { RootState } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
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
import { Messages, statusType } from "@/utils/common/enum";
import { apiHelperService } from "@/services/skill";
import { CustomTableChildComponentsProps } from "../custom-table/FieldTypes";
interface SkillData {
  _id: string;
  label: string;
  description: string;
  createdAt?: string; // Optional fields
  createdBy?: string;
  status?: string;
}

interface AddSkillProps {
  onAddSkill: () => void; // Prop to pass the new Skill
  skillData: SkillData[];
}

// Zod schema for form validation
const SkillSchema = z.object({
  label: z.string().nonempty("Please enter a Skill name"),
  description: z.string().nonempty("Please enter a description"),
  status: z.enum([statusType.ACTIVE]).default(statusType.ACTIVE),
});

const AddSkill: React.FC<CustomTableChildComponentsProps> = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // Use Skill type here
  const currentUser = useSelector((state: RootState) => state.user);
  const currentUserId = currentUser.uid;
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
  } = useForm<SkillData>({
    resolver: zodResolver(SkillSchema),
    defaultValues: {
      label: "",
      description: "",
      status: statusType.ACTIVE,
    },
  });

  // Handle form submission to add a new Skill
  const onSubmit = async (data: SkillData) => {

    try {
      const skillDataWithUser = { ...data, createdBy: currentUser.type.toUpperCase(), createdById: currentUserId };
      console.log(skillDataWithUser)
      const response = await apiHelperService.createSkill(skillDataWithUser);
      if(response.success) {
        toast({
          title: "Success",
          description: Messages.CREATE_SUCCESS("skill"),
        });
        setOpen(false)
        refetch?.()
      } else {
        toast({
          title: "Error",
          description: Messages.ADD_ERROR("skill"),
          variant: "destructive", // Red error message
        });
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Server Error",
        variant: "destructive", // Red error message
      });
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
                    <SelectItem value={statusType.ACTIVE}>Active</SelectItem>
                    <SelectItem value={statusType.INACTIVE}>
                      InActive
                    </SelectItem>
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
