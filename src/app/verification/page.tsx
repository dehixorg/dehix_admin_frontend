"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
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


interface Verificationinfo {
  verifier_id:string;
  verifier_username:string;
  requester_id:string;
  document_id:string;
  verification_status:string;
  comment:string;
  verified_at:string;
  doc_type:string;
}
const BusinessTabs = () => {
  const [experience, setexperience] = useState<Verificationinfo[] | null>(null);
  const [project,setproject] = useState<Verificationinfo[] | null>(null);
  const [education,seteducation] = useState<Verificationinfo[] | null>(null);
  const [business,setbusiness] = useState<Verificationinfo[]| null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await apiHelperService.getAllVerification();
        const data = response?.data?.data;
        
      const tempExperience: Verificationinfo[] = [];
      const tempProject: Verificationinfo[] = [];
      const tempEducation: Verificationinfo[] = [];
      const tempBusiness: Verificationinfo[] = [];

      // Iterate through data and assign based on doc_type
      if(data)
      {

      data.forEach((item:Verificationinfo) => {
        switch (item.doc_type) {
          case 'experience':
            tempExperience.push(item); 
            break;
          case 'project':
            tempProject.push(item);     
            break;
          case 'education':
            tempEducation.push(item);
            break;
          case 'business':
            tempBusiness.push(item);
            break;
          default:
            toast({
              title: "Error",
              description: "Unknown Verification",
              variant: "destructive",
            });
            break;
        }
      });
      setexperience(tempExperience);
      setproject(tempProject);
      seteducation(tempEducation);
      setbusiness(tempBusiness);
      setLoading(false); // Stop loading after data processing
    }
    else{
    toast({
      title: "Error",
      description: Messages.FETCH_ERROR("verification"),
      variant: "destructive",
    });
  }

    } catch (error) {
      toast({
        title: "Error",
        description: Messages.FETCH_ERROR("verification"),
        variant: "destructive",
      });
      setLoading(false); // Stop loading in case of an error
    }
  };

  fetchBusiness();
}, [toast]);


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
              { label: "Verification", link: "/verification" },
           
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
          <Tabs defaultValue="Experience">
            <TabsList className="flex w-full justify-between gap-2">
              <TabsTrigger value="Experience" className="flex-1 text-center">
              Experience
              </TabsTrigger>
              <TabsTrigger
                value="Project"
                className="flex-1 text-center"
              >
               Project
              </TabsTrigger>
              <TabsTrigger value="Education" className="flex-1 text-center">
              Education
              </TabsTrigger>
              <TabsTrigger
                value="Business"
                className="flex-1 text-center"
              >
               Business
              </TabsTrigger>
              
              
            </TabsList>
            <TabsContent value="Experience">
              <Verification Data={experience} />
            </TabsContent>
            <TabsContent value="Project">
              <Verification Data={project} />
            </TabsContent>
            <TabsContent value="Education">
              <Verification Data={education} />
            </TabsContent>
            <TabsContent value="Business">
              <Verification Data={business}/>
            </TabsContent>
           

          </Tabs>
        </main>
      </div>
    </div>
  );
};
export default BusinessTabs;
