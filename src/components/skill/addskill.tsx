"use client";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { Plus } from "lucide-react";
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
import { Messages, statusType } from "@/utils/common/enum";
import { apiHelperService } from "@/services/skill";
import { CustomForm } from "../custom-form/Form";
import { FormFieldType } from "../custom-form/FormTypes";
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
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

const AddSkill: React.FC<AddSkillProps> = ({ onAddSkill, skillData }) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // Use Skill type here
  const currentUser = useSelector((state: RootState) => state.user);
  const currentUserId = currentUser.uid;
  const { toast } = useToast();

  // Handle form submission to add a new Skill
  const onSubmit = async (data: SkillData) => {
    // Check if Skill already exists
    const isSkillExist = skillData.some(
      (Skill) => Skill.label.toLowerCase() === data.label.toLowerCase(),
    );

    if (isSkillExist) {
      setErrorMessage(`The Skill "${data.label}" already exists.`);
      return;
    }

    try {
      const skillDataWithUser = { ...data, createdBy: currentUser.type.toUpperCase(), createdById: currentUserId };
      // Post the new Skill to the backend
      const response = await apiHelperService.createSkill(skillDataWithUser);
            
       
      const newSkill = response.data.data;
      if (newSkill) {
        // Pass the new Skill to the parent component
        onAddSkill();
        setSuccessMessage("Skill added successfully!");
        // reset();
        setErrorMessage(null); // Clear any previous error message

        // Close the dialog after a short delay
        setTimeout(() => {
          setOpen(false);
          setSuccessMessage(null);
        }, 500);
      } else {
        toast({
          title: "Error",
          description: Messages.ADD_ERROR("skill"),
          variant: "destructive", // Red error message
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.ADD_ERROR("skill"),
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
        <CustomForm
          editable={true}
          numberOfColumns={1}
          schema={SkillSchema}
          submitHandler={onSubmit}
          title="Add Skill"
          subtitle={"Enter the Skill details below."}
          fields={[
            {
              type: FormFieldType.INPUT,
              label: "Label",
              name: "label"
            },
            {
              type: FormFieldType.TEXTAREA,
              label: "Description",
              name: "description"
            },
            {
              type: FormFieldType.RADIO,
              label: "Status",
              name: "status",
              options: [
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
              ],
              defaultValue: "active"
            }
          ]}
          className="border-0"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddSkill;
