"use client";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Messages, statusType } from "@/utils/common/enum";
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
import { apiHelperService } from "@/services/projectdomain";
import { CustomTableChildComponentsProps } from "../custom-table/FieldTypes";
interface DomainData {
  _id: string;
  label: string;
  description: string;
  createdAt?: string; // Optional fields
  createdBy?: string;
  status?: string;
}

// Zod schema for form validation
const domainSchema = z.object({
  label: z.string().min(1, "Please enter a domain name"),
  description: z.string().min(1, "Please enter a description"),
  status: z.enum([statusType.ACTIVE, statusType.INACTIVE]).default(statusType.ACTIVE),
});

const AddProjectDomain: React.FC<CustomTableChildComponentsProps> = ({
  refetch
}) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.user);
  const currentUserId = currentUser.uid;
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DomainData>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      label: "",
      description: "",
      status: statusType.ACTIVE,
    },
  });

  // Handle form submission to add a new domain
  const onSubmit = async (data: DomainData) => {
    // Check if domain already exists
    try {
      const domainDataWithUser = { ...data, createdById: currentUserId, createdBy: currentUser.type.toUpperCase() };
      // Post the new domain to the backend
      const response =
        await apiHelperService.createProjectdomain(domainDataWithUser);
      if (response.success) {
        // Pass the new domain to the parent component
        setSuccessMessage("Domain added successfully!");
        reset();
        setErrorMessage(null); // Clear any previous error message

        // Close the dialog after a short delay
        setTimeout(() => {
          setOpen(false);
          setSuccessMessage(null);
        }, 500);
        refetch?.()
      } else {
        toast({
          title: "Error",
          description: Messages.ADD_ERROR("domain"),
          variant: "destructive", // Red error message
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.ADD_ERROR("domain"),
        variant: "destructive", // Red error message
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Domain
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Domain</DialogTitle>
          <DialogDescription>Enter the domain details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <Controller
              control={control}
              name="label"
              render={({ field }) => (
                <Input
                  placeholder="Enter domain name"
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

export default AddProjectDomain;
