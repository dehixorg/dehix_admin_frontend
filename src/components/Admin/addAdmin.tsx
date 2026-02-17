import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";

import { useToast } from "@/components/ui/use-toast";
import {
  Admin_Schema_Prompt_Messages,
  Admin_Schema_Selecter,
  AdminType,
  StatusEnum,
} from "@/utils/common/enum";
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
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { ToastAction } from "@/components/ui/toast";
import { apiHelperService } from "@/services/admin";
import { CustomTableChildComponentsProps } from "../custom-table/FieldTypes";

interface AdminData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  type: AdminType;
  status: StatusEnum.PENDING; // status is fixed to "Pending"
}
const adminSchema = z.object({
  firstName: z
    .string()
    .min(1, Admin_Schema_Prompt_Messages.FIRST_NAME_REQUIRED),
  lastName: z.string().min(1, Admin_Schema_Prompt_Messages.LAST_NAME_REQUIRED),
  userName: z.string().min(1, Admin_Schema_Prompt_Messages.USERNAME_REQUIRED),
  email: z
    .string()
    .email(Admin_Schema_Prompt_Messages.VALID_MAIL)
    .min(1, Admin_Schema_Prompt_Messages.EMAIL_REQUIRED),
  phone: z.string().min(1, Admin_Schema_Prompt_Messages.PHONE_REQUIRED),
  type: z.nativeEnum(AdminType).default(AdminType.ADMIN),
  status: z.literal(StatusEnum.PENDING), // status is always "Pending"
});

const AddAdmin: React.FC<CustomTableChildComponentsProps> = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
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
      status: StatusEnum.PENDING,
      type: AdminType.ADMIN, // default type
    },
  });

  const onSubmit = async (data: AdminData) => {
    try {
      const response = await apiHelperService.createAdmin(data);
      if (response.success) {
        reset();
        setOpen(false);
        toast({
          title: "Admin Added",
          description: "The Admin has been successfully added.",
        });
        refetch?.()
      } else throw new Error("Error")
    } catch (error) {
      // Use a type guard to check if the error is an AxiosError
      let errorMessage =
        "There was an error submitting the admin details. Please try again.";
      if (error instanceof AxiosError && error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }

      toast({
        variant: "destructive",
        title: "Submission Error",
        description: errorMessage,
        action: (
          <ToastAction altText="Try again" onClick={() => reset()}>
            Retry
          </ToastAction>
        ),
      });
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
                    {Admin_Schema_Selecter.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
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
