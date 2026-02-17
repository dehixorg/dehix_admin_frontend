"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiHelperService } from "@/services/report";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface Message {
  id: string;
  sender: "user" | "admin";
  text: string;
  timestamp: string;
}
interface ImageMeta {
  Location: string;
  Key: string;
  Bucket: string;
}

interface ReportType {
  _id: string;
  subject: string;
  description: string;
  freelancer_id: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  messages: Message[];
  imageMeta?: ImageMeta[];
  report_role: string;
  reportedById: string;
  reportedByUserName?: string;
}

const ViewReportPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const { toast } = useToast();

  const [report, setReport] = useState<ReportType | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await apiHelperService.getSingleReport(id);
        setReport(res.data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch report.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReport();
  }, [id, toast]);

  useEffect(() => {
    if (!id || report?.status === "CLOSED") return;

    const interval = setInterval(async () => {
      if (document.visibilityState === "visible")
        try {
          const res = await apiHelperService.getSingleReport(id);
          const newMessages = res.data?.data?.messages || [];

          setReport((prev) => {
            if (!prev) return prev;

            const existingMessages = prev.messages || [];
            if (newMessages.length !== existingMessages.length) {
              return { ...prev, messages: newMessages };
            }
            return prev;
          });
        } catch (error) {
          // silent fail: don't show repeated toast every 5s
          console.error("Polling failed", error);
        }
    }, 5000); // poll every 5s

    return () => clearInterval(interval); // cleanup
  }, [id, report?.status]);

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast({ title: "Reply message can't be empty", variant: "destructive" });
      return;
    }
    if (!report?._id) {
      toast({
        title: "Error",
        description: "Report ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Send to API
      await apiHelperService.sendMessageToReport({
        reportId: report?._id,
        sender: "admin",
        text: replyMessage,
      });

      const newMessage: Message = {
        id: uuidv4(), // You might replace this with API response ID
        sender: "admin",
        text: replyMessage,
        timestamp: new Date().toISOString(),
      };

      setReport((prev) =>
        prev ? { ...prev, messages: [...prev.messages, newMessage] } : prev,
      );

      toast({ title: "Reply sent", description: replyMessage });

      setReplyMessage("");

      // Optionally update status if desired
      setReport((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "OPEN" ? "IN_PROGRESS" : prev.status,
            }
          : prev,
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!report?._id) {
      toast({
        title: "Error",
        description: "Report ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await apiHelperService.updateReportStatus(
        report._id,
        newStatus,
      );

      setReport((prev) =>
        prev
          ? {
              ...prev,
              status: res.data.data.status,
              updatedAt: res.data.data.updatedAt,
            }
          : prev,
      );

      toast({
        title: "Status updated",
        description: `New status: ${res.data.data.status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="p-6">Loading report...</div>;
  if (!report) return <div className="p-6">No report found.</div>;

  return (
    <AdminDashboardLayout
      active="Report"
      breadcrumbItems={[
        
        { label: "Reports", link: "/reports" },
        { label: `#${report._id?.slice(-6) ?? "N/A"}`, link: "#" },
      ]}
      showSearch={false}
      mainClassName="p-6 space-y-6"
    >
          <h1 className="text-2xl font-semibold dark:text-gray-100">
            Report Details
          </h1>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-md shadow p-4">
              <h2 className="font-semibold mb-1 text-muted-foreground dark:text-gray-400">
                Subject
              </h2>
              <p className="text-lg dark:text-gray-100">{report.subject}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-md shadow p-4">
              <h2 className="font-semibold mb-1 text-muted-foreground dark:text-gray-400">Reported By</h2>
              <p className="text-lg dark:text-gray-100">{report.reportedByUserName || report.reportedById}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-md shadow p-4">
              <h2 className="font-semibold mb-1 text-muted-foreground dark:text-gray-400">
                Status
              </h2>
              <div className="flex items-center gap-2">
                <p
                  className={`text-sm font-medium ${report.status === "OPEN" ? "text-green-600" : "text-red-600"}`}
                >
                  {report.status}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="dark:bg-zinc-900">
                    <DropdownMenuItem onClick={() => updateStatus("OPEN")}>
                      OPEN
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateStatus("IN_PROGRESS")}
                    >
                      Enable Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus("CLOSED")}>
                      CLOSED
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-md shadow p-4 sm:col-span-2 lg:col-span-4">
              <h2 className="font-semibold mb-1 text-muted-foreground dark:text-gray-400">
                Description
              </h2>
              <p className="whitespace-pre-wrap dark:text-gray-100">
                {report.description}
              </p>
            </div>
            {(report?.imageMeta ?? []).length > 0 && (
              <div className="bg-white dark:bg-zinc-900 rounded-md shadow p-4 sm:col-span-2 lg:col-span-4">
                <h2 className="font-semibold mb-1 text-muted-foreground dark:text-gray-400">
                  Attached Screenshots
                </h2>
                <div className="flex flex-wrap gap-4">
                  {(report?.imageMeta ?? []).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(img.Location)}
                      className="block w-[180px] h-[120px] overflow-hidden rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-200"
                    >
                      <Image
                        src={img.Location}
                        alt={`Screenshot ${index + 1}`}
                        width={10}
                        height={10}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
          {activeImage && (
            <div
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
              onClick={() => setActiveImage(null)}
            >
              <Image
                src={activeImage}
                alt="Full view"
                width={800}
                height={600}
                className="max-w-full max-h-full rounded shadow-lg"
              />
            </div>
          )}

          {/* CHAT SECTION */}
          <section className="bg-white dark:bg-zinc-900 rounded-md shadow p-6 max-w-3xl mx-auto w-full">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Message Thread
            </h2>

            <div className="h-[400px] overflow-y-auto space-y-4 px-2">
              {/* Original Report Case as Context */}
              <div className="flex justify-start">
                <div className="max-w-[85%] px-4 py-3 rounded-lg text-sm shadow-sm bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase mb-1">
                    INITIAL REPORT FROM: {report.reportedByUserName || report.reportedById}
                  </p>
                  <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 italic">
                    &quot;{report.description}&quot;
                  </p>
                  <p className="text-[10px] text-muted-foreground dark:text-gray-400 mt-2">
                    Reported At: {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-b dark:border-zinc-800 my-4 flex items-center justify-center">
                <span className="bg-white dark:bg-zinc-900 px-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                  Discussion Thread
                </span>
              </div>

              {report.messages?.length ? (
                report.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "admin" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] font-medium text-muted-foreground mb-1 px-1">
                      {msg.sender === "admin" ? "Admin" : (report.reportedByUserName || "Reporter")}
                    </span>
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-lg text-sm shadow-sm ${
                        msg.sender === "admin"
                          ? "bg-blue-100 dark:bg-blue-950 text-right text-gray-900 dark:text-gray-100"
                          : "bg-gray-100 dark:bg-gray-700 text-left text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <p className="text-[10px] text-muted-foreground dark:text-gray-400 mt-1">
                        {new Date(msg.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground dark:text-gray-400 text-center mt-10">No discussion messages yet.</p>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <Textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write your message..."
                className="text-sm bg-background dark:bg-zinc-800 text-foreground dark:text-gray-100"
                rows={4}
              />
              <div className="flex justify-end">
                <Button onClick={handleReply}>Send Message</Button>
              </div>
            </div>
          </section>
    </AdminDashboardLayout>
  );
};

export default ViewReportPage;
