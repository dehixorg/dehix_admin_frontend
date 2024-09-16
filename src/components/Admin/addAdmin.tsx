import React, { useState } from "react";
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
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from "@/components/ui/select";

interface AdminData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  type: "Admin" | "Super_Admin";
   status: "Pending"; // status is fixed to "Pending"
}

const adminSchema = z.object({
  firstName: z.string().nonempty("Please enter the first name"),
  lastName: z.string().nonempty("Please enter the last name"),
  userName: z.string().nonempty("Please enter the username"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().nonempty("Please enter the phone number"),
  type: z.enum(["Admin", "Super_Admin"]).default("Admin"),
  status: z.literal("Pending"), // status is always "Pending"
});

const AddAdmin: React.FC = () => {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      phone: "",
      status:"Pending",
      type: "Admin", // default type
    },
  });

  const onSubmit = async (data: AdminData) => {
    try {
      console.log("Submitting data:", data);
      await axiosInstance.post(`/admin/create`, data);
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting admin:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Admin</DialogTitle>
          <DialogDescription>Enter the admin details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="First Name"
                  {...field}
                  className="border p-2 rounded mt-2 w-full"
                />
              )}
            />
            {errors.firstName && (
              <p className="text-red-600">{errors.firstName.message}</p>
            )}
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Last Name"
                  {...field}
                  className="border p-2 rounded mt-2 w-full"
                />
              )}
            />
            {errors.lastName && (
              <p className="text-red-600">{errors.lastName.message}</p>
            )}
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="userName"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Username"
                  {...field}
                  className="border p-2 rounded mt-2 w-full"
                />
              )}
            />
            {errors.userName && (
              <p className="text-red-600">{errors.userName.message}</p>
            )}
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  type="email"
                  placeholder="Email"
                  {...field}
                  className="border p-2 rounded mt-2 w-full"
                />
              )}
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Phone"
                  {...field}
                  className="border p-2 rounded mt-2 w-full"
                />
              )}
            />
            {errors.phone && (
              <p className="text-red-600">{errors.phone.message}</p>
            )}
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Super_Admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-red-600">{errors.type.message}</p>
            )}
          </div>
          <DialogFooter className="mt-3">
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdmin;
