"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import DropdownProfile from "@/components/shared/DropdownProfile";
import Breadcrumb from "@/components/shared/breadcrumbList";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  menuItemsTop,
  menuItemsBottom,
} from "@/config/menuItems/admin/dashboardMenuItems";
import { LoaderCircle } from "lucide-react";
import { apiHelperService } from "@/services/report";

interface Message {
  id: string;
  sender: "user" | "admin";
  text: string;
  timestamp: string;
  senderName?: string;
}

interface ImageMeta {
  Location: string;
  Key: string;
  Bucket: string;
}

interface ReportedMessage {
  _id: string;
  messageId: string;
  conversationId: string;
  reportedById: string;
  reportedByEmail?: string;
  reportedByUserName?: string;
  messageSenderId: string;
  messageSenderEmail?: string;
  messageSenderUserName?: string;
  messageContent: string;
  messageTimestamp: string;
  reason?: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  resolution?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  messages: Message[];
  imageMeta?: ImageMeta[];
  createdAt: string;
}

function ReportedMessagesContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { toast } = useToast();

  const [message, setMessage] = useState<ReportedMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const fetchReportedMessage = useCallback(async () => {
    if (!id) return;
    try {
      const response = await apiHelperService.getReportedMessageById(id);
      if (response.success) {
        setMessage(response.data.data);
      } else {
        throw new Error(
          response.data?.message || "Failed to load report details."
        );
      }
    } catch (error: any) {
      console.error("Failed to fetch reported message detail:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load report details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchReportedMessage();
  }, [fetchReportedMessage]);

  // Polling for new messages
  useEffect(() => {
    if (!id || message?.status === "CLOSED") return;

    const interval = setInterval(async () => {
      if (document.visibilityState === "visible") {
        try {
          const response = await apiHelperService.getReportedMessageById(id);
          if (response.success) {
            const newData = response.data.data;
            if (newData.messages?.length !== (message?.messages?.length || 0)) {
              setMessage(newData);
            }
          }
        } catch (error) {
          console.error("Polling failed", error);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, message?.status, message?.messages?.length]);

  const updateStatus = async (newStatus: "OPEN" | "IN_PROGRESS" | "CLOSED") => {
    if (!id) return;
    setUpdatingStatus(true);
    try {
      const response = await apiHelperService.updateReportedMessageStatus(
        id,
        newStatus
      );
      if (response.success) {
        toast({
          title: "Success",
          description: `Status updated to ${newStatus}`,
        });
        fetchReportedMessage();
      } else {
        throw new Error(response.data?.message || "Failed to update status.");
      }
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleReply = async () => {
    if (!id) return;
    if (!replyMessage.trim()) {
      toast({ title: "Reply message can't be empty", variant: "destructive" });
      return;
    }

    try {
      const response = await apiHelperService.sendMessageToReportedMessage({
        reportId: id,
        sender: "admin",
        text: replyMessage,
      });

      if (response.success) {
        const newMessage: Message = {
          id: uuidv4(),
          sender: "admin",
          text: replyMessage,
          timestamp: new Date().toISOString(),
        };

        setMessage((prev) =>
          prev
            ? { ...prev, messages: [...(prev.messages || []), newMessage] }
            : prev
        );

        toast({ title: "Reply sent" });
        setReplyMessage("");
      } else {
        throw new Error(response.data?.message || "Failed to send message.");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted/40 dark:bg-zinc-950">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  if (!message)
    return <div className="p-10 text-center">Report not found.</div>;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-zinc-950">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Reports"
      />

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background dark:bg-zinc-950 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Reports"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Reports", link: "/reports" },
              { label: `#${message._id?.slice(-6) ?? "N/A"}`, link: "#" },
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <DropdownProfile />
          </div>
        </header>

        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold dark:text-gray-100">
            Report Details{" "}
            <span className="text-sm font-normal text-muted-foreground">
              (Reported Message)
            </span>
          </h1>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-md shadow p-4">
              <h2 className="font-semibold mb-1 text-muted-foreground dark:text-gray-400">
                Subject
              </h2>
              <p className="text-lg dark:text-gray-100 break-words">
                Message Report
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-md shadow p-4">
              <h2 className="font-semibold mb-1 text-muted-foreground dark:text-gray-400">
                Message Sender
              </h2>
              <p className="text-lg dark:text-gray-100 break-words">
                {message.messageSenderUserName || message.messageSenderId}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-md shadow p-4">
              <h2 className="font-semibold mb-1 text-muted-foreground dark:text-gray-400">
                Reported By
              </h2>
              <p className="text-lg dark:text-gray-100 break-words">
                {message.reportedByUserName || message.reportedById}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-md shadow p-4">
              <h2 className="font-semibold mb-1 text-muted-foreground dark:text-gray-400">
                Status
              </h2>
              <div className="flex items-center gap-2">
                <p
                  className={`text-sm font-medium ${message.status === "OPEN" ? "text-green-600" : message.status === "CLOSED" ? "text-red-600" : "text-yellow-600"}`}
                >
                  {message.status}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updatingStatus}
                    >
                      {updatingStatus ? "..." : "Update"}
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
            <div className="bg-white dark:bg-zinc-900 rounded-md shadow p-4 sm:col-span-2 lg:col-span-3">
              <h2 className="font-semibold mb-1 text-muted-foreground dark:text-gray-400">
                Reported Message
              </h2>
              <p className="whitespace-pre-wrap dark:text-gray-100">
                {message.messageContent}
              </p>
            </div>

            {(message?.imageMeta ?? []).length > 0 && (
              <div className="bg-white dark:bg-zinc-900 rounded-md shadow p-4 sm:col-span-2 lg:col-span-3">
                <h2 className="font-semibold mb-1 text-muted-foreground dark:text-gray-400">
                  Attached Screenshots
                </h2>
                <div className="flex flex-wrap gap-4">
                  {(message?.imageMeta ?? []).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(img.Location)}
                      className="block w-[180px] h-[120px] overflow-hidden rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-200"
                    >
                      <Image
                        src={img.Location}
                        alt={`Screenshot ${index + 1}`}
                        width={180}
                        height={120}
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
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={() => setActiveImage(null)}
            >
              <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                <Image
                  src={activeImage}
                  alt="Full view"
                  layout="fill"
                  objectFit="contain"
                  className="rounded shadow-lg"
                />
              </div>
            </div>
          )}

          {/* CHAT SECTION / MESSAGE THREAD */}
          <section className="bg-white dark:bg-zinc-900 rounded-md shadow p-6 max-w-3xl mx-auto w-full">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Message Thread
            </h2>

            <div className="h-[400px] overflow-y-auto space-y-4 px-2">
              {/* Original Reported Message as Context */}
              <div className="flex justify-start">
                <div className="max-w-[85%] px-4 py-3 rounded-lg text-sm shadow-sm bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase mb-1">
                    REPORTED MESSAGE FROM:{" "}
                    {message.messageSenderUserName || message.messageSenderId}
                  </p>
                  <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 italic">
                    &quot;{message.messageContent}&quot;
                  </p>
                  <p className="text-[10px] text-muted-foreground dark:text-gray-400 mt-2">
                    Original Time: {formatDate(message.messageTimestamp)}
                  </p>
                </div>
              </div>

              <div className="border-b dark:border-zinc-800 my-4 flex items-center justify-center">
                <span className="bg-white dark:bg-zinc-900 px-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                  Report Discussion
                </span>
              </div>

              {message.messages?.length ? (
                message.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${msg.sender === "admin" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] font-medium text-muted-foreground mb-1 px-1">
                      {msg.sender === "admin"
                        ? "Admin"
                        : message.reportedByUserName || "Reporter"}
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
                        {formatDate(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground dark:text-gray-400 text-center mt-10">
                  No discussion messages yet.
                </p>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <Textarea
                value={replyMessage}
                onChange={(e: any) => setReplyMessage(e.target.value)}
                placeholder="Write your message..."
                className="text-sm bg-background dark:bg-zinc-800 text-foreground dark:text-gray-100"
                rows={4}
              />
              <div className="flex justify-end">
                <Button onClick={handleReply}>Send Message</Button>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="text-xs text-muted-foreground space-y-1 border-t dark:border-zinc-700 pt-4">
                <p>
                  Reported By:{" "}
                  {message.reportedByUserName || message.reportedById}
                </p>
                <p>Reason: {message.reason || "N/A"}</p>
                <p>Report ID: {message._id}</p>
                <p>Reported At: {formatDate(message.createdAt)}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function ReportedMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-muted/40 dark:bg-zinc-950">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ReportedMessagesContent />
    </Suspense>
  );
}
