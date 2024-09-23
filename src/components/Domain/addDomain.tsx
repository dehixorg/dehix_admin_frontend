"use client";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { RootState } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
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

interface DomainData {
  _id: string;
  label: string;
  description: string;
  createdAt?: string; // Optional fields
  createdBy?: string;
  status?: string;
}

interface Domain {
  _id: string;
  label: string;
  description: string;
}

interface AddDomainProps {
  onAddDomain: (newDomain: DomainData) => void; // Prop to pass the new domain
}

// Zod schema for form validation
const domainSchema = z.object({
  label: z.string().nonempty("Please enter a domain name"),
  description: z.string().nonempty("Please enter a description"),
  status: z.enum(["Active"]).default("Active"),
});

const AddDomain: React.FC<AddDomainProps> = ({ onAddDomain }) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]); // Use Domain type here
  const currentUserId = "user-id-123";
  //const currentUserId = useSelector((state: RootState) => state.user);
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
      status: "Active",
    },
  });

  // Fetch the list of domains from the backend
  useEffect(() => {
    async function fetchDomains() {
      try {
        const response = await axiosInstance.get("/domain/all");
        setDomains(response.data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch domain data . Please try again.",
          variant: "destructive", // Red error message
        });
      }
    }

    fetchDomains();
  }, []);

  // Handle form submission to add a new domain
  const onSubmit = async (data: DomainData) => {
    // Check if domain already exists
    const isDomainExist = domains.some(
      (domain) => domain.label.toLowerCase() === data.label.toLowerCase(),
    );

    if (isDomainExist) {
      setErrorMessage(`The domain "${data.label}" already exists.`);
      return;
    }

    try {
      const domainDataWithUser = { ...data, createdBy: currentUserId };
      // Post the new domain to the backend
      const response = await axiosInstance.post(
        `/domain/createdomain`,
        domainDataWithUser,
      );
      const newDomain = response.data.data;

      // Pass the new domain to the parent component
      onAddDomain(newDomain);

      // Reset the form and show success message
      setSuccessMessage("Domain added successfully!");
      reset();
      setErrorMessage(null); // Clear any previous error message

      // Close the dialog after a short delay
      setTimeout(() => {
        setOpen(false);
        setSuccessMessage(null);
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add domain . Please try again.",
        variant: "destructive", // Red error message
      });
      setErrorMessage("Failed to add the domain. Please try again.");
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

export default AddDomain;
