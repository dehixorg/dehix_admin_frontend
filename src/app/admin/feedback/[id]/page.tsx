"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Loader2,
  Edit,
  Save,
  X,
  Trash2,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiHelperService } from "@/services/admin";

const campaignSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean(),
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

export default function FeedbackDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasSubmissions, setHasSubmissions] = useState(false);
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
      isActive: true,
      targetAudience: {
        userType: undefined as any,
        minAccountAgeDays: undefined,
        freelancerRules: {},
        businessRules: {},
      },
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const userType = watch("targetAudience.userType");

  const fetchCampaignDetails = async () => {
    setLoading(true);
    try {
      const response =
        await apiHelperService.getFeedbackCampaignById(campaignId);
      const data = response.data.data;
      setCampaign(data);

      // Initialize form with campaign data
      const formData: CampaignFormData = {
        title: data.title || "",
        description: data.description || "",
        isActive: data.isActive ?? true,
        targetAudience: {
          userType: data.targetAudience?.userType || (undefined as any),
          minAccountAgeDays: data.targetAudience?.minAccountAgeDays,
          freelancerRules: data.targetAudience?.freelancerRules || {},
          businessRules: data.targetAudience?.businessRules || {},
        },
        questions:
          data.questions?.map((q: any) => ({
            questionText: q.questionText || "",
            type: q.type || "RATING_5_STAR",
            optionsText:
              q.type === "MULTIPLE_CHOICE" && q.options
                ? q.options.join("\n")
                : "",
            isRequired: q.isRequired ?? true,
          })) || [],
      };
      reset(formData);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to load campaign details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSubmissions = async () => {
    try {
      const response =
        await apiHelperService.getFeedbackCampaignSubmissions(campaignId);
      const submissions = response.data.data || [];
      setHasSubmissions(submissions.length > 0);
    } catch (error) {
      setHasSubmissions(false);
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails();
      checkSubmissions();
    }
  }, [campaignId]);

  const onSave = async (data: CampaignFormData) => {
    setSaving(true);
    try {
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

      await apiHelperService.updateFeedbackCampaign(
        campaignId,
        transformedData
      );
      toast({
        title: "Success",
        description: "Campaign updated successfully",
      });
      setIsEditMode(false);
      fetchCampaignDetails();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update campaign",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiHelperService.archiveFeedbackCampaign(campaignId);
      toast({
        title: "Success",
        description: "Campaign archived successfully",
      });
      router.push("/admin/feedback");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to archive campaign",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form to original campaign data
    if (campaign) {
      const formData: CampaignFormData = {
        title: campaign.title || "",
        description: campaign.description || "",
        isActive: campaign.isActive ?? true,
        targetAudience: {
          userType: campaign.targetAudience?.userType || (undefined as any),
          minAccountAgeDays: campaign.targetAudience?.minAccountAgeDays,
          freelancerRules: campaign.targetAudience?.freelancerRules || {},
          businessRules: campaign.targetAudience?.businessRules || {},
        },
        questions:
          campaign.questions?.map((q: any) => ({
            questionText: q.questionText || "",
            type: q.type || "RATING_5_STAR",
            optionsText:
              q.type === "MULTIPLE_CHOICE" && q.options
                ? q.options.join("\n")
                : "",
            isRequired: q.isRequired ?? true,
          })) || [],
      };
      reset(formData);
    }
  };

  const getStatusBadge = () => {
    if (!campaign) return null;

    if (campaign.isArchived) {
      return <Badge variant="destructive">Archived</Badge>;
    }
    return campaign.isActive ? (
      <Badge className="bg-green-500">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const getUserTypeBadge = (userType: string) => {
    const colors: Record<string, string> = {
      FREELANCER: "bg-blue-100 text-blue-800",
      BUSINESS: "bg-green-100 text-green-800",
      ALL: "bg-purple-100 text-purple-800",
    };
    return <Badge className={colors[userType] || ""}>{userType}</Badge>;
  };

  const getQuestionTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      RATING_5_STAR: "bg-yellow-100 text-yellow-800",
      TEXT_AREA: "bg-blue-100 text-blue-800",
      MULTIPLE_CHOICE: "bg-purple-100 text-purple-800",
    };
    return <Badge className={colors[type] || ""}>{type}</Badge>;
  };

  return (
    <AdminDashboardLayout
      active="Feedback"
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Feedback", link: "/admin/feedback" },
        { label: "Campaign Details", link: "#" },
      ]}
      showSearch={false}
      mainClassName="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8"
    >
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/feedback")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feedback
        </Button>

        {!loading && campaign && !isEditMode && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditMode(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}

        {isEditMode && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit(onSave)}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">
            Loading campaign details...
          </span>
        </div>
      )}

      {!loading && !campaign && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Campaign not found
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            The requested feedback campaign could not be found.
          </p>
        </div>
      )}

      {!loading && campaign && (
        <form className="bg-card rounded-lg border p-6 space-y-8">
          {/* Warning for campaigns with submissions */}
          {isEditMode && hasSubmissions && (
            <div className="flex items-start gap-2 p-4 border border-yellow-200 bg-yellow-50 rounded-md">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">
                This campaign has existing submissions. Question editing is
                disabled to maintain data integrity.
              </p>
            </div>
          )}

          {/* Basic Info Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-b pb-3">
              Basic Information
            </h2>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Title {isEditMode && "*"}</Label>
                {isEditMode ? (
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="title"
                        placeholder="Campaign title"
                        {...field}
                        className="mt-1"
                      />
                    )}
                  />
                ) : (
                  <p className="text-lg font-semibold mt-1">{campaign.title}</p>
                )}
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">
                  Description {isEditMode && "*"}
                </Label>
                {isEditMode ? (
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="description"
                        placeholder="Campaign description"
                        {...field}
                        className="mt-1"
                      />
                    )}
                  />
                ) : (
                  <p className="text-base mt-1">{campaign.description}</p>
                )}
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Status</Label>
                {isEditMode ? (
                  <div className="flex items-center space-x-2 mt-1">
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
                    <Label htmlFor="isActive">Active Campaign</Label>
                  </div>
                ) : (
                  <div className="mt-1">{getStatusBadge()}</div>
                )}
              </div>
            </div>
          </div>

          {/* Target Audience Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-b pb-3">
              Target Audience
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="userType">User Type {isEditMode && "*"}</Label>
                {isEditMode ? (
                  <Controller
                    name="targetAudience.userType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Users</SelectItem>
                          <SelectItem value="FREELANCER">
                            Freelancers
                          </SelectItem>
                          <SelectItem value="BUSINESS">Businesses</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <div className="mt-1">
                    {getUserTypeBadge(
                      campaign.targetAudience?.userType || "N/A"
                    )}
                  </div>
                )}
              </div>

              {(isEditMode || campaign.targetAudience?.minAccountAgeDays) && (
                <div>
                  <Label htmlFor="minAccountAgeDays">
                    Minimum Account Age (Days)
                  </Label>
                  {isEditMode ? (
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
                          className="mt-1"
                        />
                      )}
                    />
                  ) : (
                    <p className="text-base mt-1">
                      {campaign.targetAudience.minAccountAgeDays} days
                    </p>
                  )}
                </div>
              )}

              {/* Freelancer Rules */}
              {(userType === "FREELANCER" || (!isEditMode && campaign.targetAudience?.userType === "FREELANCER")) &&
                ((isEditMode) || (campaign.targetAudience?.freelancerRules &&
                  Object.keys(campaign.targetAudience.freelancerRules).length >
                    0)) && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      Freelancer Requirements
                    </p>
                    {isEditMode ? (
                      <div className="space-y-3 border p-3 rounded">
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
                            <Label htmlFor="minCurrentLevel">
                              Min Current Level
                            </Label>
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
                            <Label htmlFor="minLongestStreak">
                              Min Longest Streak
                            </Label>
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
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Requirement</TableHead>
                            <TableHead>Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {campaign.targetAudience.freelancerRules
                            .minVerifiedDehixTalent !== undefined && (
                            <TableRow>
                              <TableCell>Min Verified Dehix Talent</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.freelancerRules
                                    .minVerifiedDehixTalent
                                }
                              </TableCell>
                            </TableRow>
                          )}
                          {campaign.targetAudience.freelancerRules
                            .minCompletedProjects !== undefined && (
                            <TableRow>
                              <TableCell>Min Completed Projects</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.freelancerRules
                                    .minCompletedProjects
                                }
                              </TableCell>
                            </TableRow>
                          )}
                          {campaign.targetAudience.freelancerRules
                            .minCurrentLevel !== undefined && (
                            <TableRow>
                              <TableCell>Min Current Level</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.freelancerRules
                                    .minCurrentLevel
                                }
                              </TableCell>
                            </TableRow>
                          )}
                          {campaign.targetAudience.freelancerRules
                            .minLongestStreak !== undefined && (
                            <TableRow>
                              <TableCell>Min Longest Streak</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.freelancerRules
                                    .minLongestStreak
                                }
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}

              {/* Business Rules */}
              {(userType === "BUSINESS" || (!isEditMode && campaign.targetAudience?.userType === "BUSINESS")) &&
                ((isEditMode) || (campaign.targetAudience?.businessRules &&
                  Object.keys(campaign.targetAudience.businessRules).length >
                    0)) && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      Business Requirements
                    </p>
                    {isEditMode ? (
                      <div className="space-y-3 border p-3 rounded">
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
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Requirement</TableHead>
                            <TableHead>Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {campaign.targetAudience.businessRules
                            .minProjectCreated !== undefined && (
                            <TableRow>
                              <TableCell>Min Projects Created</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.businessRules
                                    .minProjectCreated
                                }
                              </TableCell>
                            </TableRow>
                          )}
                          {campaign.targetAudience.businessRules
                            .minFreelancerHired !== undefined && (
                            <TableRow>
                              <TableCell>Min Freelancers Hired</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.businessRules
                                    .minFreelancerHired
                                }
                              </TableCell>
                            </TableRow>
                          )}
                          {campaign.targetAudience.businessRules
                            .minDehixTalentHired !== undefined && (
                            <TableRow>
                              <TableCell>Min Dehix Talent Hired</TableCell>
                              <TableCell>
                                {
                                  campaign.targetAudience.businessRules
                                    .minDehixTalentHired
                                }
                              </TableCell>
                            </TableRow>
                          )}
                          {campaign.targetAudience.businessRules.minMoneySpend !==
                            undefined && (
                            <TableRow>
                              <TableCell>Min Money Spent</TableCell>
                              <TableCell>
                                $
                                {
                                  campaign.targetAudience.businessRules
                                    .minMoneySpend
                                }
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold border-b pb-3 flex-1">
                Questions ({fields.length})
              </h2>
              {isEditMode && !hasSubmissions && (
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
              )}
            </div>
            <div className="space-y-4">
              {isEditMode ? (
                <>
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 border p-4 rounded bg-muted/30">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">
                          Question {index + 1}
                        </h4>
                        {!hasSubmissions && fields.length > 1 && (
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
                            <Input
                              placeholder="Enter question text"
                              disabled={hasSubmissions}
                              {...field}
                            />
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
                              disabled={hasSubmissions}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select question type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="RATING_5_STAR">
                                  Rating (5 Stars)
                                </SelectItem>
                                <SelectItem value="TEXT_AREA">
                                  Text Area
                                </SelectItem>
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
                                disabled={hasSubmissions}
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
                              disabled={hasSubmissions}
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
                </>
              ) : (
                <>
                  {campaign.questions?.map((question: any, index: number) => (
                    <div
                      key={question._id || index}
                      className="border rounded-lg p-4 space-y-3 bg-muted/30"
                    >
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-base">
                          {index + 1}. {question.questionText}
                        </p>
                        {question.isRequired && (
                          <Badge variant="destructive" className="ml-2">
                            Required
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getQuestionTypeBadge(question.type)}
                        {question.type === "MULTIPLE_CHOICE" &&
                          question.options &&
                          question.options.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-muted-foreground">
                                Options:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {question.options.map(
                                  (option: string, idx: number) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="font-normal"
                                    >
                                      {option}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                  {(!campaign.questions || campaign.questions.length === 0) && (
                    <p className="text-sm text-muted-foreground italic">
                      No questions available
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </form>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive this campaign? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
}
