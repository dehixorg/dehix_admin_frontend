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
import { BadgeImageUpload } from "./BadgeImageUpload";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface GamificationCriteria {
  minProjectApplications?: number;
  minVerifiedDehixTalent?: number;
  minVerifiedInterviewTalents?: number;
  minInterviewsTaken?: number;
  minTalentHiring?: number;
  minBids?: number;
  minLongestStreak?: number;
  requiresVerifiedProfile?: boolean;
  requiresOracle?: boolean;
}

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
  criteria?: GamificationCriteria;
}

const badgeLevelSchema = z
  .object({
    name: z.string().min(1, "Please enter a name"),
    description: z.string().min(1, "Please enter a description"),
    type: z.enum(["BADGE", "LEVEL"]).default("BADGE"),
    isActive: z.boolean().default(true),
    imageUrl: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    // LEVEL-specific fields
    priority: z.number().optional(),
    rewardMultiplier: z.number().optional(),
    // Badge-specific fields
    baseReward: z.number().optional(),
    criteria: z.object({
      minProjectApplications: z.number().optional(),
      minVerifiedDehixTalent: z.number().optional(),
      minVerifiedInterviewTalents: z.number().optional(),
      minInterviewsTaken: z.number().optional(),
      minTalentHiring: z.number().optional(),
      minBids: z.number().optional(),
      minLongestStreak: z.number().optional(),
      requiresVerifiedProfile: z.boolean().optional(),
      requiresOracle: z.boolean().optional(),
    }),
  })
  .refine(
    (data) => {
      if (data.type === "LEVEL") {
        return (
          data.priority !== undefined && data.rewardMultiplier !== undefined
        );
      }
      if (data.type === "BADGE") {
        return data.baseReward !== undefined;
      }
      return true;
    },
    {
      message: "Type-specific fields are required",
    }
  )
  .refine(
    (data) => {
      if (!data.criteria) return false;
      const criteriaValues = Object.values(data.criteria);
      return criteriaValues.some(
        (value) =>
          value !== undefined &&
          value !== null &&
          value !== false &&
          value !== 0
      );
    },
    {
      message: "At least one criteria field must be filled",
      path: ["criteria"],
    }
  );

const EditBadgeLevel: React.FC<
  CustomTableChildComponentsProps & {
    data: any;
    onClose?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
> = ({ data, refetch, onClose, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };
  const { toast } = useToast();

  // Initialize useForm with default values - hooks must be called before any conditional logic
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<BadgeLevelData>({
    resolver: zodResolver(badgeLevelSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      type: data?.type || "BADGE",
      isActive: data?.isActive !== undefined ? data?.isActive : true,
      imageUrl: data?.imageUrl || "",
      // Add default values for optional fields
      priority: data?.priority || 0,
      rewardMultiplier: data?.rewardMultiplier || 1.0,
      baseReward: data?.baseReward || 0,
      criteria: data?.criteria || {},
    },
  });

  const selectedType = watch("type");

  // Add null check for data prop - return a placeholder instead of null
  if (!data) {
    return <span>No data available</span>;
  }

  const onSubmit = async (formData: BadgeLevelData) => {
    try {
      const response = await axiosInstance.put(
        `/admin/gamification/levelsandbadges/${data._id}`,
        formData
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: Messages.UPDATE_SUCCESS("badge/level"),
        });
        refetch?.();
        onClose?.();
      } else {
        throw new Error("Failed to update badge/level");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || Messages.UPDATE_ERROR("badge/level"),
        variant: "destructive",
      });
    } finally {
      reset();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
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
      )}
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Badge/Level</DialogTitle>
          <DialogDescription>
            Update badge or level details below.
          </DialogDescription>
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
          <div className="mb-3 flex items-center justify-between">
            <Label htmlFor="isActive">Active Status</Label>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
          {selectedType === "BADGE" && (
            <div className="mb-3">
              <Label htmlFor="imageUrl">Badge Image</Label>
              <Controller
                control={control}
                name="imageUrl"
                render={({ field }) => (
                  <BadgeImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.imageUrl && (
                <p className="text-red-600">{errors.imageUrl.message}</p>
              )}
            </div>
          )}

          {/* Criteria Section */}
          <div className="mb-4 border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">
              Criteria * (At least one required)
            </h3>
            <div className="space-y-3">
              {/* Numeric Criteria Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="minProjectApplications" className="text-sm">
                    Min Project Applications
                  </Label>
                  <Controller
                    control={control}
                    name="criteria.minProjectApplications"
                    render={({ field }) => (
                      <Input
                        id="minProjectApplications"
                        type="number"
                        placeholder="0"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        className="mt-1"
                      />
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="minVerifiedDehixTalent" className="text-sm">
                    Min Verified Dehix Talent
                  </Label>
                  <Controller
                    control={control}
                    name="criteria.minVerifiedDehixTalent"
                    render={({ field }) => (
                      <Input
                        id="minVerifiedDehixTalent"
                        type="number"
                        placeholder="0"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        className="mt-1"
                      />
                    )}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="minVerifiedInterviewTalents"
                    className="text-sm"
                  >
                    Min Verified Interview Talents
                  </Label>
                  <Controller
                    control={control}
                    name="criteria.minVerifiedInterviewTalents"
                    render={({ field }) => (
                      <Input
                        id="minVerifiedInterviewTalents"
                        type="number"
                        placeholder="0"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        className="mt-1"
                      />
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="minInterviewsTaken" className="text-sm">
                    Min Interviews Taken
                  </Label>
                  <Controller
                    control={control}
                    name="criteria.minInterviewsTaken"
                    render={({ field }) => (
                      <Input
                        id="minInterviewsTaken"
                        type="number"
                        placeholder="0"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        className="mt-1"
                      />
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="minTalentHiring" className="text-sm">
                    Min Talent Hiring
                  </Label>
                  <Controller
                    control={control}
                    name="criteria.minTalentHiring"
                    render={({ field }) => (
                      <Input
                        id="minTalentHiring"
                        type="number"
                        placeholder="0"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        className="mt-1"
                      />
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="minBids" className="text-sm">
                    Min Bids
                  </Label>
                  <Controller
                    control={control}
                    name="criteria.minBids"
                    render={({ field }) => (
                      <Input
                        id="minBids"
                        type="number"
                        placeholder="0"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        className="mt-1"
                      />
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="minLongestStreak" className="text-sm">
                    Min Longest Streak
                  </Label>
                  <Controller
                    control={control}
                    name="criteria.minLongestStreak"
                    render={({ field }) => (
                      <Input
                        id="minLongestStreak"
                        type="number"
                        placeholder="0"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        className="mt-1"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Boolean Criteria Fields */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="criteria.requiresVerifiedProfile"
                    render={({ field }) => (
                      <Checkbox
                        id="requiresVerifiedProfile"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label
                    htmlFor="requiresVerifiedProfile"
                    className="text-sm cursor-pointer"
                  >
                    Requires Verified Profile
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="criteria.requiresOracle"
                    render={({ field }) => (
                      <Checkbox
                        id="requiresOracle"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label
                    htmlFor="requiresOracle"
                    className="text-sm cursor-pointer"
                  >
                    Requires Oracle
                  </Label>
                </div>
              </div>
            </div>
            {errors.criteria && (
              <p className="text-red-600 text-sm mt-1">
                {errors.criteria.message}
              </p>
            )}
          </div>

          {selectedType === "LEVEL" && (
            <>
              <div className="mb-3">
                <Label htmlFor="priority">Priority *</Label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Input
                      id="priority"
                      type="number"
                      placeholder="Priority"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                      className="border p-2 rounded mt-2 w-full"
                    />
                  )}
                />
                {errors.priority && (
                  <p className="text-red-600">{errors.priority.message}</p>
                )}
              </div>
              <div className="mb-3">
                <Label htmlFor="rewardMultiplier">Reward Multiplier *</Label>
                <Controller
                  control={control}
                  name="rewardMultiplier"
                  render={({ field }) => (
                    <Input
                      id="rewardMultiplier"
                      type="number"
                      step="0.1"
                      placeholder="Reward Multiplier"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                      className="border p-2 rounded mt-2 w-full"
                    />
                  )}
                />
                {errors.rewardMultiplier && (
                  <p className="text-red-600">
                    {errors.rewardMultiplier.message}
                  </p>
                )}
              </div>
            </>
          )}

          {selectedType === "BADGE" && (
            <div className="mb-3">
              <Label htmlFor="baseReward">Base Reward *</Label>
              <Controller
                control={control}
                name="baseReward"
                render={({ field }) => (
                  <Input
                    id="baseReward"
                    type="number"
                    placeholder="Base Reward"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                    className="border p-2 rounded mt-2 w-full"
                  />
                )}
              />
              {errors.baseReward && (
                <p className="text-red-600">{errors.baseReward.message}</p>
              )}
            </div>
          )}

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
