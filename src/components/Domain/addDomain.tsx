"use client";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { RootState } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter } from "@/components/ui/dialog";
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
import { apiHelperService } from "@/services/domain";
import { CustomDialog } from "../CustomDialog";
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
  status: z.enum([statusType.active, statusType.inactive]).default(statusType.active),
});

const AddDomain: React.FC<CustomTableChildComponentsProps> = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user);

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
      status: statusType.active,
    },
  });

  // Fetch the list of domains from the backend
  // Handle form submission to add a new domain
  const onSubmit = async (data: DomainData) => {
    try {
      const domainDataWithUser = {
        ...data,
        createdBy: currentUser.type.toUpperCase(),
        createdById: currentUser.uid,
      };
      // Post the new domain to the backend
      const response = await apiHelperService.createDomain(domainDataWithUser);
      const newDomain = response.data.data;
      refetch?.();
      reset();
      toast({
        title: "Success",
        description: Messages.CREATE_SUCCESS(newDomain),
      });
      // Close the dialog after a short delay
      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: Messages.ADD_ERROR("domain"),
        variant: "destructive", // Red error message
      });
    }
  };

  return (
    <CustomDialog
      title={"Add Domain"}
      description={"Enter the domain details below."}
      content={
        <>
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
                      <SelectItem value={statusType.active}>Active</SelectItem>
                      <SelectItem value={statusType.inactive}>
                        InActive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </>
      }
      triggerContent={
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Domain
        </Button>
      }
      triggerState={open}
      setTriggerState={setOpen}
    />
  );
};

export default AddDomain;
