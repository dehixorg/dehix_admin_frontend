"use client";

import { useState } from "react";
import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/admin/dashboardMenuItems";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";
import { CustomTable } from "@/components/custom-table/CustomTable";
import {
  CustomComponentProps,
  FieldType,
  Params as TableProps,
} from "@/components/custom-table/FieldTypes";
import AddFeedbackCampaign from "@/components/Feedback/AddFeedbackCampaign";
import EditFeedbackCampaign from "@/components/Feedback/EditFeedbackCampaign";
import ViewSubmissions from "@/components/Feedback/ViewSubmissions";
import ViewDetailsDialog from "@/components/Feedback/ViewDetailsDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ChevronRight, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiHelperService } from "@/services/admin";

export default function FeedbackPage() {
  const customTableProps: TableProps = {
    api: "/admin/feedback/campaign",
    uniqueId: "_id",
    fields: [
      {
        fieldName: "title",
        textValue: "Title",
        type: FieldType.TEXT,
      },
      {
        fieldName: "description",
        textValue: "Description",
        type: FieldType.LONGTEXT,
        wordsCnt: 20,
      },
      {
        textValue: "Target Audience",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data }: CustomComponentProps) => {
          const userType = data.targetAudience?.userType ?? "N/A";
          const colors: Record<string, string> = {
            FREELANCER: "bg-blue-100 text-blue-800",
            BUSINESS: "bg-green-100 text-green-800",
            ALL: "bg-purple-100 text-purple-800",
          };
          return <Badge className={colors[userType]}>{userType}</Badge>;
        },
      },
      {
        textValue: "Status",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data }: CustomComponentProps) => {
          if (data.isArchived) {
            return <Badge variant="destructive">Archived</Badge>;
          }
          return data.isActive ? (
            <Badge className="bg-green-500">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          );
        },
      },
      {
        textValue: "Questions",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data }: CustomComponentProps) => {
          return <span>{data.questions?.length || 0}</span>;
        },
      },
      {
        textValue: "Submissions",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data, id }: CustomComponentProps) => {
          return <ViewSubmissions campaignId={id} />;
        },
      },
      {
        textValue: "Actions",
        type: FieldType.CUSTOM,
        CustomComponent: ({ data, id, refetch }: CustomComponentProps) => {
          const ActionsComponent = () => {
            const [editDialogOpen, setEditDialogOpen] = useState(false);
            const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
            const [deleting, setDeleting] = useState(false);
            const { toast } = useToast();

            const handleDelete = async () => {
              setDeleting(true);
              try {
                await apiHelperService.archiveFeedbackCampaign(id);
                toast({
                  title: "Success",
                  description: "Campaign archived successfully",
                });
                setDeleteDialogOpen(false);
                refetch?.();
              } catch (error: any) {
                toast({
                  title: "Error",
                  description:
                    error?.response?.data?.message ||
                    "Failed to archive campaign",
                  variant: "destructive",
                });
              } finally {
                setDeleting(false);
              }
            };

            return (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={deleting}>
                      {deleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <ViewDetailsDialog campaignId={id} campaignData={data} />
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setEditDialogOpen(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setDeleteDialogOpen(true)}
                      disabled={deleting}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <EditFeedbackCampaign
                  campaignId={id}
                  campaignData={data}
                  refetch={refetch}
                  open={editDialogOpen}
                  onOpenChange={setEditDialogOpen}
                />

                <Dialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Archive Campaign</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to archive this campaign? This
                        action cannot be undone.
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
              </>
            );
          };

          return <ActionsComponent />;
        },
      },
    ],
    tableHeaderActions: [AddFeedbackCampaign],
    isDownload: false,
    searchColumn: ["title", "description"],
    title: "Feedback Campaigns",
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Feedback"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Feedback"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/admin" },
              { label: "Feedback", link: "#" },
            ]}
          />
          <div className="ml-auto">
            <DropdownProfile />
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <CustomTable {...customTableProps} />
        </main>
      </div>
    </div>
  );
}
