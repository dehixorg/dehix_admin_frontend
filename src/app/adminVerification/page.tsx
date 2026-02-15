"use client";

import { use, useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import { apiHelperService } from "@/services/verification";
import { Messages } from "@/utils/common/enum";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/admin/dashboardMenuItems";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";
import Verification from "@/components/verification/verificationTable";
import { useSelector } from "react-redux";

interface Verificationinfo {
  verifier_id:string;
  verifier_username: string;
  requester_id: string;
  document_id: string;
  verification_status: string;
  comment: string;
  verified_at: string;
  doc_type: string;
}

const BusinessTabs = () => {
  const [adminVerifications, setAdminVerifications] = useState<Verificationinfo[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const user = useSelector((state: any) => state.user);
  const userId = user.uid;

  useEffect(() => {
    const fetchAdminVerifications = async () => {
      try {
        if (!userId) {
          setLoading(false);
          return;
        }
        const response = await apiHelperService.getAllVerificationsById(userId);
        const data = response?.data?.data;
        
        if (data) {
          setAdminVerifications(data);
        }
        
      } catch (error) {
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("verification"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminVerifications();
    
  }, [userId, toast]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Business"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Business"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "" },
              { label: "Admin Oracle Verification", link: "/adminVerification" },
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownProfile />
        </header>
        <main className="ml-5 mr-5">
          <Tabs defaultValue="Admin Oracle Verification">
            <TabsList className="flex w-full justify-between gap-2">
              <TabsTrigger value="Admin Oracle Verification" className="flex-1 text-center">
                Admin Oracle Verification
              </TabsTrigger>
            </TabsList>
            <TabsContent value="Admin Oracle Verification">
              <Verification Data={adminVerifications}/>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default BusinessTabs;