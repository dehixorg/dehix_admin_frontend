import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
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

const AddBadgeLevel: React.FC<CustomTableChildComponentsProps> = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<BadgeLevelData>({
    resolver: zodResolver(badgeLevelSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "BADGE",
      isActive: true,
      imageUrl: "",
      // Add default values for optional fields
      priority: 0,
      rewardMultiplier: 1.0,
      baseReward: 0,
    },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: BadgeLevelData) => {
    console.log('Form submitted with data:', data);
    console.log('Form errors:', errors);
    
    // Check if there are validation errors
    if (Object.keys(errors).length > 0) {
      console.log('Form has validation errors:', errors);
      return;
    }
    
    try {
      // Make actual API call to backend with authentication
      const response = await axiosInstance.post('/admin/gamification/definition', data);
      console.log('API response:', response);

      if(response.status === 201) {
        toast({
          title: "Success",
          description: Messages.CREATE_SUCCESS("badge/level"),
        });
        refetch?.()
      }
      else {
        console.log('API error response:', response);
        throw new Error('Failed to create badge/level')
      }
    } catch (error: any) {
      console.log('Submit error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || Messages.ADD_ERROR("badge/level"),
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
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Badge/Level
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Badge/Level</DialogTitle>
          <DialogDescription>Enter the badge or level details below.</DialogDescription>
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

          {/* Type-specific fields */}
          {selectedType === "LEVEL" && (
            <>
              <div className="mb-3">
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Priority"
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
                      placeholder="Reward Multiplier"
                      {...field}
                      className="border p-2 rounded mt-2 w-full"
                    />
                  )}
                />
              </div>
            </>
          )}

          {selectedType === "BADGE" && (
            <div className="mb-3">
              <Controller
                control={control}
                name="baseReward"
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Base Reward"
                    {...field}
                    className="border p-2 rounded mt-2 w-full"
                  />
                )}
              />
            </div>
          )}

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

export default AddBadgeLevel;
