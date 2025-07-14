"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiHelperService } from "@/services/report";
import { useToast } from "@/components/ui/use-toast";
import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import { menuItemsBottom, menuItemsTop } from "@/config/menuItems/admin/dashboardMenuItems";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid';

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
  imageMeta?: ImageMeta[]; // ✅ Now an array
  report_role:string;
  reportedById:string;
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
        console.log(id)
        const res = await apiHelperService.getSingleReport(id);
        setReport(res.data.data);
        console.log(res)
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
}, [id]);


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
      prev
        ? { ...prev, messages: [...prev.messages, newMessage] }
        : prev
    );

    toast({ title: "Reply sent", description: replyMessage });

    setReplyMessage("");

    // Optionally update status if desired
    setReport((prev) =>
      prev
        ? { ...prev, status: prev.status === "OPEN" ? "IN_PROGRESS" : prev.status }
        : prev
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
    const res = await apiHelperService.updateReportStatus(report._id, newStatus);

    setReport((prev) =>
      prev
        ? { ...prev, status: res.data.data.status, updatedAt: res.data.data.updatedAt }
        : prev
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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Report"
      />

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Report"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Reports", link: "/reports" },
              { label: `#${report._id?.slice(-6) ?? "N/A"}`, link: "#" },
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <DropdownProfile />
          </div>
        </header>

        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold">Report Details</h1>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-md shadow p-4">
              <h2 className="font-semibold mb-1 text-muted-foreground">Subject</h2>
              <p className="text-lg">{report.subject}</p>
            </div>
            <div className="bg-white rounded-md shadow p-4">
              <h2 className="font-semibold mb-1 text-muted-foreground">{report.report_role} ID</h2>
              <p className="text-lg">{report.reportedById}</p>
            </div>
            <div className="bg-white rounded-md shadow p-4">
              <h2 className="font-semibold mb-1 text-muted-foreground">Status</h2>
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium ${report.status === "OPEN" ? "text-green-600" : "text-red-600"}`}>
                  {report.status}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">Update</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => updateStatus("OPEN")}>OPEN</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus("IN_PROGRESS")}>Enable Chat</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus("CLOSED")}>CLOSED</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="bg-white rounded-md shadow p-4 sm:col-span-2 lg:col-span-3">
              <h2 className="font-semibold mb-1 text-muted-foreground">Description</h2>
              <p className="whitespace-pre-wrap">{report.description}</p>
            </div>
           {(report?.imageMeta ?? []).length > 0 && (
  <div className="bg-white rounded-md shadow p-4 sm:col-span-2 lg:col-span-3">
    <h2 className="font-semibold mb-1 text-muted-foreground">Attached Screenshots</h2>
    <div className="flex flex-wrap gap-4">
      {(report?.imageMeta ?? []).map((img, index) => (
        <button
          key={index}
          onClick={() => setActiveImage(img.Location)}
          className="block w-[180px] h-[120px] overflow-hidden rounded-lg shadow-sm border hover:scale-105 transition-transform duration-200"
        >
          <Image
            src={img.Location}
            alt={`Screenshot ${index + 1}`}
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
      className="max-w-full max-h-full rounded shadow-lg"
    />
  </div>
)}


          {/* CHAT SECTION */}
          <section className="bg-white rounded-md shadow p-6 max-w-3xl mx-auto w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Message Thread</h2>

            <div className="h-[400px] overflow-y-auto space-y-4 px-2">
              {report.messages?.length ? (
  report.messages.map((msg) => (
    <div
      key={msg.id}
      className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg text-sm shadow-sm ${
          msg.sender === "admin"
            ? "bg-blue-100 text-right text-gray-900"
            : "bg-gray-100 text-left text-gray-900"
        }`}
      >
        <p className="whitespace-pre-wrap">{msg.text}</p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {new Date(msg.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  ))
) : (
  <p className="text-sm text-muted-foreground text-center mt-10">No messages yet.</p>
)}

            </div>

            <div className="mt-6 space-y-2">
              <Textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write your message..."
                className="text-sm"
                rows={4}
              />
              <div className="flex justify-end">
                <Button onClick={handleReply}>Send Message</Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
    
  );
};

export default ViewReportPage;
