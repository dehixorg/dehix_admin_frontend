"use client";

import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiHelperService } from "@/services/admin";
import { CustomTableChildComponentsProps } from "@/components/custom-table/FieldTypes";

const campaignSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  targetAudience: z.object({
    userType: z.enum(["FREELANCER", "BUSINESS", "ALL"]),
    minAccountAgeDays: z.number().optional(),
    freelancerRules: z
      .object({
        minVerifiedDehixTalent: z.number().optional(),
        minCompletedProjects: z.number().optional(),
        minCurrentLevel: z.number().optional(),
        minLongestStreak: z.number().optional(),
      })
      .optional(),
    businessRules: z
      .object({
        minProjectCreated: z.number().optional(),
        minFreelancerHired: z.number().optional(),
        minDehixTalentHired: z.number().optional(),
        minMoneySpend: z.number().optional(),
      })
      .optional(),
  }),
  questions: z
    .array(
      z.object({
        questionText: z.string().min(1, "Question text is required"),
        type: z.enum(["RATING_5_STAR", "TEXT_AREA", "MULTIPLE_CHOICE"]),
        optionsText: z.string().optional(),
        isRequired: z.boolean(),
      })
    )
    .min(1, "At least one question is required"),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

export default function AddFeedbackCampaign({
  refetch,
}: CustomTableChildComponentsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      description: "",
      targetAudience: {
        userType: undefined as any,
        minAccountAgeDays: undefined,
        freelancerRules: {},
        businessRules: {},
      },
      questions: [
        {
          questionText: "",
          type: "RATING_5_STAR",
          optionsText: "",
          isRequired: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const userType = watch("targetAudience.userType");

  const onSubmit = async (data: CampaignFormData) => {
    setLoading(true);
    try {
      // Transform questions with options
      const transformedData = {
        ...data,
        questions: data.questions.map((q) => ({
          questionText: q.questionText,
          type: q.type,
          isRequired: q.isRequired,
          options:
            q.type === "MULTIPLE_CHOICE" && q.optionsText
              ? q.optionsText
                .split("\n")
                .filter((o) => o.trim())
                .map((o) => o.trim())
              : undefined,
        })),
      };

      await apiHelperService.createFeedbackCampaign(transformedData);
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
      reset();
      setOpen(false);
      refetch?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs sm:text-sm px-2 sm:px-4">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="whitespace-nowrap">Create Campaign</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Feedback Campaign</DialogTitle>
          <DialogDescription>
            Create a new feedback campaign with custom questions and target
            audience rules.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input id="title" placeholder="Campaign title" {...field} />
                )}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    placeholder="Campaign description"
                    {...field}
                  />
                )}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Target Audience</h3>

            <div>
              <Label htmlFor="userType">User Type *</Label>
              <Controller
                name="targetAudience.userType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Users</SelectItem>
                      <SelectItem value="FREELANCER">Freelancers</SelectItem>
                      <SelectItem value="BUSINESS">Businesses</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="minAccountAgeDays">Min Account Age (Days)</Label>
              <Controller
                name="targetAudience.minAccountAgeDays"
                control={control}
                render={({ field }) => (
                  <Input
                    id="minAccountAgeDays"
                    type="number"
                    placeholder="Optional"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    value={field.value ?? ""}
                  />
                )}
              />
            </div>

            {/* Freelancer Rules */}
            {userType === "FREELANCER" && (
              <div className="space-y-3 border p-3 rounded">
                <h4 className="font-medium text-sm">Freelancer Rules</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="minVerifiedDehixTalent">
                      Min Verified Dehix Talent
                    </Label>
                    <Controller
                      name="targetAudience.freelancerRules.minVerifiedDehixTalent"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="minVerifiedDehixTalent"
                          type="number"
                          placeholder="Optional"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          value={field.value ?? ""}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minCompletedProjects">
                      Min Completed Projects
                    </Label>
                    <Controller
                      name="targetAudience.freelancerRules.minCompletedProjects"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="minCompletedProjects"
                          type="number"
                          placeholder="Optional"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          value={field.value ?? ""}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minCurrentLevel">Min Current Level</Label>
                    <Controller
                      name="targetAudience.freelancerRules.minCurrentLevel"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="minCurrentLevel"
                          type="number"
                          placeholder="Optional"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          value={field.value ?? ""}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minLongestStreak">Min Longest Streak</Label>
                    <Controller
                      name="targetAudience.freelancerRules.minLongestStreak"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="minLongestStreak"
                          type="number"
                          placeholder="Optional"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          value={field.value ?? ""}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Business Rules */}
            {userType === "BUSINESS" && (
              <div className="space-y-3 border p-3 rounded">
                <h4 className="font-medium text-sm">Business Rules</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="minProjectCreated">
                      Min Projects Created
                    </Label>
                    <Controller
                      name="targetAudience.businessRules.minProjectCreated"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="minProjectCreated"
                          type="number"
                          placeholder="Optional"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          value={field.value ?? ""}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minFreelancerHired">
                      Min Freelancers Hired
                    </Label>
                    <Controller
                      name="targetAudience.businessRules.minFreelancerHired"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="minFreelancerHired"
                          type="number"
                          placeholder="Optional"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          value={field.value ?? ""}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minDehixTalentHired">
                      Min Dehix Talent Hired
                    </Label>
                    <Controller
                      name="targetAudience.businessRules.minDehixTalentHired"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="minDehixTalentHired"
                          type="number"
                          placeholder="Optional"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          value={field.value ?? ""}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minMoneySpend">Min Money Spent</Label>
                    <Controller
                      name="targetAudience.businessRules.minMoneySpend"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="minMoneySpend"
                          type="number"
                          placeholder="Optional"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          value={field.value ?? ""}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Questions</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    questionText: "",
                    type: "RATING_5_STAR",
                    optionsText: "",
                    isRequired: true,
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 border p-4 rounded">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Question {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div>
                  <Label htmlFor={`questions.${index}.questionText`}>
                    Question Text *
                  </Label>
                  <Controller
                    name={`questions.${index}.questionText`}
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Enter question text" {...field} />
                    )}
                  />
                  {errors.questions?.[index]?.questionText && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.questions[index]?.questionText?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`questions.${index}.type`}>Type *</Label>
                  <Controller
                    name={`questions.${index}.type`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RATING_5_STAR">
                            Rating (5 Stars)
                          </SelectItem>
                          <SelectItem value="TEXT_AREA">Text Area</SelectItem>
                          <SelectItem value="MULTIPLE_CHOICE">
                            Multiple Choice
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {watch(`questions.${index}.type`) === "MULTIPLE_CHOICE" && (
                  <div>
                    <Label htmlFor={`questions.${index}.optionsText`}>
                      Options (one per line) *
                    </Label>
                    <Controller
                      name={`questions.${index}.optionsText`}
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          rows={4}
                          {...field}
                        />
                      )}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Controller
                    name={`questions.${index}.isRequired`}
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id={`questions.${index}.isRequired`}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor={`questions.${index}.isRequired`}>
                    Required
                  </Label>
                </div>
              </div>
            ))}

            {errors.questions &&
              typeof errors.questions.message === "string" && (
                <p className="text-sm text-red-500">
                  {errors.questions.message}
                </p>
              )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Campaign"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
