"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, X, Calendar as CalendarIcon, Medal, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/leaderboard";
import { CustomTableChildComponentsProps } from "@/components/custom-table/FieldTypes";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const leaderboardSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    frequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"], {
      required_error: "Frequency is required",
    }),
    periodStart: z.date({ required_error: "Start date is required" }),
    periodEnd: z.date({ required_error: "End date is required" }),
    repeat: z.boolean().default(false),
    rewardConfig: z
      .array(
        z.object({
          rank: z.number().min(1).max(3),
          title: z.string().min(1, "Title is required"),
          baseAmount: z.number().min(0.01, "Amount must be greater than 0"),
        })
      )
      .length(3, "Exactly 3 reward ranks are required"),
    scoringRules: z
      .array(
        z.object({
          condition: z.enum([
            "projectApplications",
            "verifiedDehixTalent",
            "verifiedInterviewTalents",
            "interviewsTaken",
            "talentHiring",
            "bids",
            "longestStreak",
            "verifiedProfile",
            "oracle",
          ]),
          min: z.number().min(0),
          weight: z.number().min(0),
        })
      )
      .min(1, "At least one scoring rule is required"),
    eligibility: z.object({
      badgesAllowed: z.array(z.string()),
      levelsAllowed: z.array(z.string()),
    }),
  })
  .refine((data) => data.periodEnd > data.periodStart, {
    message: "End date must be after start date",
    path: ["periodEnd"],
  });

type LeaderboardFormData = z.infer<typeof leaderboardSchema>;

const conditionOptions = [
  { value: "projectApplications", label: "Project Applications" },
  { value: "verifiedDehixTalent", label: "Verified Dehix Talent" },
  { value: "verifiedInterviewTalents", label: "Verified Interview Talents" },
  { value: "interviewsTaken", label: "Interviews Taken" },
  { value: "talentHiring", label: "Talent Hiring" },
  { value: "bids", label: "Bids" },
  { value: "longestStreak", label: "Longest Streak" },
  { value: "verifiedProfile", label: "Verified Profile" },
  { value: "oracle", label: "Oracle" },
];

export default function CreateLeaderboardDialog({
  refetch,
}: CustomTableChildComponentsProps) {
  const [open, setOpen] = useState(false);
  const [badges, setBadges] = useState<Array<{ _id: string; name: string }>>(
    []
  );
  const [levels, setLevels] = useState<Array<{ _id: string; name: string }>>(
    []
  );
  const [loadingOptions, setLoadingOptions] = useState(true);
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeaderboardFormData>({
    resolver: zodResolver(leaderboardSchema),
    defaultValues: {
      name: "",
      description: "",
      frequency: "MONTHLY",
      repeat: false,
      rewardConfig: [
        { rank: 1, title: "", baseAmount: 0 },
        { rank: 2, title: "", baseAmount: 0 },
        { rank: 3, title: "", baseAmount: 0 },
      ],
      scoringRules: [{ condition: "projectApplications", min: 0, weight: 5 }],
      eligibility: {
        badgesAllowed: [],
        levelsAllowed: [],
      },
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "rewardConfig",
  });

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({
    control,
    name: "scoringRules",
  });

  const watchedFrequency = useWatch({ control, name: "frequency" });
  const watchedPeriodStart = useWatch({ control, name: "periodStart" });
  const watchedRules = useWatch({ control, name: "scoringRules" });

  useEffect(() => {
    if (watchedFrequency && watchedPeriodStart) {
      const durations = {
        WEEKLY: 7,
        BIWEEKLY: 15,
        MONTHLY: 30,
      };
      const endDate = addDays(watchedPeriodStart, durations[watchedFrequency]);
      setValue("periodEnd", endDate);
    }
  }, [watchedFrequency, watchedPeriodStart, setValue]);

  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        const response = await apiHelperService.getGamificationDefinitions();
        if (response.success) {
          const gamificationData = response.data.data || [];
          const badgeList = gamificationData.filter(
            (item: any) => item.type === "BADGE" && item.isActive
          );
          const levelList = gamificationData.filter(
            (item: any) => item.type === "LEVEL" && item.isActive
          );
          setBadges(badgeList.map((b: any) => ({ _id: b._id, name: b.name })));
          setLevels(levelList.map((l: any) => ({ _id: l._id, name: l.name })));
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load badges and levels",
          variant: "destructive",
        });
      } finally {
        setLoadingOptions(false);
      }
    };
    if (open) {
      fetchGamificationData();
    }
  }, [open, toast]);

  const onSubmit = async (data: LeaderboardFormData) => {
    try {
      await apiHelperService.createLeaderboard(data);
      toast({
        title: "Success",
        description: "Leaderboard created successfully",
      });
      reset();
      setOpen(false);
      if (refetch) {
        refetch();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create leaderboard",
        variant: "destructive",
      });
    }
  };

  const getRankIcon = (rank: number) => {
    const colors = ["text-yellow-500", "text-gray-400", "text-amber-600"];
    return <Medal className={`h-5 w-5 ${colors[rank - 1]}`} />;
  };

  const getRankLabel = (rank: number) => {
    const labels = ["1st Place", "2nd Place", "3rd Place"];
    return labels[rank - 1];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Leaderboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Leaderboard Contest</DialogTitle>
          <DialogDescription>
            Set up a new leaderboard contest with reward configuration
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Contest Name *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    id="name"
                    placeholder="Enter contest name"
                    {...field}
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    placeholder="Enter contest description"
                    rows={3}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="BIWEEKLY">Biweekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.frequency && (
                <p className="text-sm text-red-500">
                  {errors.frequency.message}
                </p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              {/* Period Start */}
              <div className="space-y-2">
                <Label>Period Start *</Label>
                <Controller
                  name="periodStart"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.periodStart && (
                  <p className="text-sm text-red-500">
                    {errors.periodStart.message}
                  </p>
                )}
              </div>

              {/* Period End */}
              <div className="space-y-2">
                <Label>Period End *</Label>
                <Controller
                  name="periodEnd"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.periodEnd && (
                  <p className="text-sm text-red-500">
                    {errors.periodEnd.message}
                  </p>
                )}
              </div>
            </div>

            {/* Repeat */}
            <div className="flex items-center space-x-2">
              <Controller
                name="repeat"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="repeat"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="repeat" className="cursor-pointer">
                Repeat this contest automatically
              </Label>
            </div>

            {/* Scoring Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Scoring Rules
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const usedConditions = new Set(
                        watchedRules?.map((r: any) => r.condition) || []
                      );
                      const firstAvailable =
                        conditionOptions.find(
                          (opt) => !usedConditions.has(opt.value)
                        )?.value || conditionOptions[0].value;
                      appendRule({
                        condition: firstAvailable as any,
                        min: 0,
                        weight: 1,
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ruleFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-end gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <Label htmlFor={`rule-condition-${index}`}>
                          Condition
                        </Label>
                        <Controller
                          name={`scoringRules.${index}.condition`}
                          control={control}
                          render={({ field }) => {
                            const otherRules =
                              watchedRules?.filter((_, i) => i !== index) || [];
                            const otherSelectedConditions = new Set(
                              otherRules.map((r: any) => r.condition)
                            );

                            return (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {conditionOptions
                                    .filter(
                                      (opt) =>
                                        !otherSelectedConditions.has(opt.value)
                                    )
                                    .map((opt) => (
                                      <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                      >
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            );
                          }}
                        />
                      </div>
                      <div className="w-24">
                        <Label htmlFor={`rule-min-${index}`}>Min</Label>
                        <Controller
                          name={`scoringRules.${index}.min`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          )}
                        />
                      </div>
                      <div className="w-24">
                        <Label htmlFor={`rule-weight-${index}`}>Weight</Label>
                        <Controller
                          name={`scoringRules.${index}.weight`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeRule(index)}
                        disabled={ruleFields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {errors.scoringRules && (
                    <p className="text-sm text-red-500">
                      {errors.scoringRules.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Eligibility Criteria */}
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Badges Multi-Select */}
                <div className="space-y-2">
                  <Label>Allowed Badges</Label>
                  {loadingOptions ? (
                    <p className="text-sm text-muted-foreground">
                      Loading badges...
                    </p>
                  ) : (
                    <Controller
                      name="eligibility.badgesAllowed"
                      control={control}
                      render={({ field }) => (
                        <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                          {badges.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No badges available
                            </p>
                          ) : (
                            badges.map((badge) => (
                              <div
                                key={badge._id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  checked={field.value?.includes(badge._id)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, badge._id]);
                                    } else {
                                      field.onChange(
                                        current.filter(
                                          (id: string) => id !== badge._id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <label className="text-sm cursor-pointer">
                                  {badge.name}
                                </label>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    />
                  )}
                </div>

                {/* Levels Multi-Select */}
                <div className="space-y-2">
                  <Label>Allowed Levels</Label>
                  {loadingOptions ? (
                    <p className="text-sm text-muted-foreground">
                      Loading levels...
                    </p>
                  ) : (
                    <Controller
                      name="eligibility.levelsAllowed"
                      control={control}
                      render={({ field }) => (
                        <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                          {levels.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No levels available
                            </p>
                          ) : (
                            levels.map((level) => (
                              <div
                                key={level._id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  checked={field.value?.includes(level._id)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, level._id]);
                                    } else {
                                      field.onChange(
                                        current.filter(
                                          (id: string) => id !== level._id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <label className="text-sm cursor-pointer">
                                  {level.name}
                                </label>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reward Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Reward Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="space-y-3 p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {getRankIcon(index + 1)}
                        <span className="font-semibold">
                          {getRankLabel(index + 1)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`title-${index}`}>Title *</Label>
                        <Controller
                          name={`rewardConfig.${index}.title`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              id={`title-${index}`}
                              placeholder="e.g., Gold Winner"
                              {...field}
                            />
                          )}
                        />
                        {errors.rewardConfig?.[index]?.title && (
                          <p className="text-sm text-red-500">
                            {errors.rewardConfig[index]?.title?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`amount-${index}`}>
                          Base Amount ($) *
                        </Label>
                        <Controller
                          name={`rewardConfig.${index}.baseAmount`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              id={`amount-${index}`}
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          )}
                        />
                        {errors.rewardConfig?.[index]?.baseAmount && (
                          <p className="text-sm text-red-500">
                            {errors.rewardConfig[index]?.baseAmount?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
              {isSubmitting ? "Creating..." : "Create Contest"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
