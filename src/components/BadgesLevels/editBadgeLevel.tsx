import React, { useState } from "react";
import { Edit } from "lucide-react";
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
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Messages } from "@/utils/common/enum";
import { CustomTableChildComponentsProps } from "../custom-table/FieldTypes";

interface BadgeLevelData {
  name: string;
  description: string;
  type: string;
  isActive: boolean;
  imageUrl: string;
  // LEVEL-specific fields
  priority?: number;
  rewardMultiplier?: number;
  // Badge-specific fields
  baseReward?: number;
}

const badgeLevelSchema = z.object({
  name: z.string().min(1, "Please enter a name"),
  description: z.string().min(1, "Please enter a description"),
  type: z.enum(["BADGE", "LEVEL"]).default("BADGE"),
  isActive: z.boolean().default(true),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  // LEVEL-specific fields
  priority: z.number().optional(),
  rewardMultiplier: z.number().optional(),
  // Badge-specific fields
  baseReward: z.number().optional(),
});

const EditBadgeLevel: React.FC<CustomTableChildComponentsProps & { data: any; onClose?: () => void }> = ({ data, refetch, onClose }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  // Add debugging to see what data is being received
  console.log('EditBadgeLevel received data:', data);
  
  // Initialize useForm with default values - hooks must be called before any conditional logic
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BadgeLevelData>({
    resolver: zodResolver(badgeLevelSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      type: data?.type || "BADGE",
      isActive: data?.isActive !== undefined ? true : data?.isActive,
      imageUrl: data?.imageUrl || "",
      // Add default values for optional fields
      priority: data?.priority || 0,
      rewardMultiplier: data?.rewardMultiplier || 1.0,
      baseReward: data?.baseReward || 0,
    },
  });
  
  // Add null check for data prop - return a placeholder instead of null
  if (!data) {
    console.error('EditBadgeLevel: data prop is undefined');
    return <span>No data available</span>;
  }

  const onSubmit = async (formData: BadgeLevelData) => {
    console.log('Edit form submitted with data:', formData);
    try {
      const response = await axiosInstance.put(`/admin/gamification/definition/${data._id}`, formData);
      console.log('API response:', response);

      if(response.status === 200) {
        toast({
          title: "Success",
          description: Messages.UPDATE_SUCCESS("badge/level"),
        });
        refetch?.()
        onClose?.()
      }
      else {
        console.log('API error response:', response);
        throw new Error('Failed to update badge/level')
      }
    } catch (error: any) {
      console.log('Edit error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || Messages.UPDATE_ERROR("badge/level"),
        variant: "destructive",
      });
    } finally {
      reset();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={() => setOpen(true)} 
          variant="default" 
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Badge/Level</DialogTitle>
          <DialogDescription>Update badge or level details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Name"
                  {...field}
                  className="border p-2 rounded mt-2 w-full"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
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
                  className="border p-2 rounded mt-2 w-full"
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
              name="type"
              render={({ field }) => (
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BADGE">Badge</SelectItem>
                    <SelectItem value="LEVEL">Level</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="imageUrl"
              render={({ field }) => (
                <Input
                  type="url"
                  placeholder="Image URL (optional)"
                  {...field}
                  className="border p-2 rounded mt-2 w-full"
                />
              )}
            />
            {errors.imageUrl && (
              <p className="text-red-600">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* LEVEL-specific fields */}
          <div className="mb-3">
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="Priority (for levels)"
                  {...field}
                  className="border p-2 rounded mt-2 w-full"
                />
              )}
            />
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="rewardMultiplier"
              render={({ field }) => (
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Reward Multiplier (for levels)"
                  {...field}
                  className="border p-2 rounded mt-2 w-full"
                />
              )}
            />
          </div>

          {/* BADGE-specific fields */}
          <div className="mb-3">
            <Controller
              control={control}
              name="baseReward"
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="Base Reward (for badges)"
                  {...field}
                  className="border p-2 rounded mt-2 w-full"
                />
              )}
            />
          </div>

          <DialogFooter className="mt-3">
            <Button className="w-full" type="submit">
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBadgeLevel;
