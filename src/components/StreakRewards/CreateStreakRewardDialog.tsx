"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { streakRewardService } from "@/services/streakRewardService";
import { Plus } from "lucide-react";

const streakRewardSchema = z.object({
  days: z.number().min(1, { message: "Days must be at least 1" }),
  reward: z.number().min(1, { message: "Reward must be at least 1" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type StreakRewardFormData = z.infer<typeof streakRewardSchema>;

interface CreateStreakRewardDialogProps {
  refetch?: () => void;
}

const CreateStreakRewardDialog: React.FC<CreateStreakRewardDialogProps> = ({
  refetch,
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<StreakRewardFormData>({
    resolver: zodResolver(streakRewardSchema),
    defaultValues: {
      days: undefined,
      reward: undefined,
      title: "",
      description: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: StreakRewardFormData) => {
    setIsSubmitting(true);
    try {
      // Fetch existing streak rewards to check for duplicate days
      const existingRewardsResponse =
        await streakRewardService.getAllStreakRewards();
      const existingRewards = existingRewardsResponse.data.data || [];

      // Check if days value already exists
      const duplicateDays = existingRewards.find(
        (reward: any) => reward.days === data.days
      );

      if (duplicateDays) {
        setError("days", {
          type: "manual",
          message: `A streak reward for ${data.days} days already exists`,
        });
        setIsSubmitting(false);
        return;
      }

      await streakRewardService.createStreakReward(data);
      toast({
        title: "Success",
        description: "Streak reward created successfully",
      });
      reset();
      setOpen(false);
      if (refetch) refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create streak reward",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Create Streak Reward
      </Button>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Streak Reward</DialogTitle>
          <DialogDescription>
            Configure a new streak reward milestone for freelancers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Days Field */}
          <div className="space-y-2">
            <Label htmlFor="days">Days *</Label>
            <Controller
              name="days"
              control={control}
              render={({ field }) => (
                <Input
                  id="days"
                  type="number"
                  placeholder="Enter number of days"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.days && (
              <p className="text-sm text-red-500">{errors.days.message}</p>
            )}
          </div>

          {/* Reward Field */}
          <div className="space-y-2">
            <Label htmlFor="reward">Reward (Connects) *</Label>
            <Controller
              name="reward"
              control={control}
              render={({ field }) => (
                <Input
                  id="reward"
                  type="number"
                  placeholder="Enter reward amount"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.reward && (
              <p className="text-sm text-red-500">{errors.reward.message}</p>
            )}
          </div>

          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  id="title"
                  placeholder="e.g., 7-Day Streak Reward"
                  {...field}
                />
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="description"
                  placeholder="Enter description (optional)"
                  rows={3}
                  {...field}
                />
              )}
            />
          </div>

          {/* Active Status Switch */}
          <div className="flex items-center space-x-2">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStreakRewardDialog;
