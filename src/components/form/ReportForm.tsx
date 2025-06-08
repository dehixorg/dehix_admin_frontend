import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { apiHelperService } from "@/services/report";

// ✅ Schema
const reportSchema = z.object({
  subject: z.string().min(3, { message: "Subject is required" }),
  description: z.string().min(10, { message: "Description must be more detailed" }),
  report_type: z.string().min(2, { message: "Report type is required" }),
  reportedId: z.string().min(1, { message: "Reported ID is required" }),
  status: z.string().optional(),         // added internally
  reportedById: z.string().optional(),   // added internally
});

// ✅ Type inference
export type ReportFormValues = z.infer<typeof reportSchema>;

// ✅ Component
export function ReportForm({ initialData }: { initialData: ReportFormValues }) {
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ReportFormValues) => {
    try {
      // 🔐 Replace with actual user ID from auth/session
      const reportedById = "12345"; // <-- Replace with real user ID

      const finalPayload = {
        ...data,
        reportedById,
        status: "OPEN",
      };

      const response = await apiHelperService.createReport(finalPayload);
      console.log("Report submitted successfully:", response);
      // Optional: reset form or show toast
    } catch (error) {
      console.error("Failed to submit report:", error);
    }
  };

  return (
    <Card className="p-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Subject */}
          <div className="space-y-2">
            <Label>Subject</Label>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Issue subject" {...field} />
                  </FormControl>
                  <FormDescription>e.g., App is crashing</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Describe the issue in detail..." {...field} />
                  </FormControl>
                  <FormDescription>Provide details about what happened.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Hidden: ReportedId */}
          <FormField
            control={form.control}
            name="reportedId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" readOnly {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Role (Report Type) - Disabled Select */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="report_type"
              render={({ field }) => (
                <FormItem>
                  <Label>Role</Label>
                  <Select
                    defaultValue={field.value}
                    onValueChange={() => {}} // disables change
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-100 cursor-not-allowed">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={field.value}>{field.value}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit">Submit Report</Button>
        </form>
      </Form>
    </Card>
  );
}
