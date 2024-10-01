"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/admin/dashboardMenuItems";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";
import PersonalInfo from "@/components/business/businessInfo/personalInfo";
import ProfessionalInfo from "@/components/business/businessInfo/professionalInfo";
import ProjectList from "@/components/business/businessInfo/projectList";
import Appliedcandidates from "@/components/business/businessInfo/appliedCandidates";
import Hirefreelancer from "@/components/business/businessInfo/hireCandidates";

const BusinessTabs = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // console.log("Retrieved ID:", id);
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
              { label: "Business", link: "/business" },
              { label: id as string, link: "#" },
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
          <Tabs defaultValue="Personal-Info">
            <TabsList className="flex w-full justify-between gap-2">
              <TabsTrigger value="Personal-Info" className="flex-1 text-center">
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="Professional-Info"
                className="flex-1 text-center"
              >
                Professional Info
              </TabsTrigger>
              <TabsTrigger value="ProjectList" className="flex-1 text-center">
                Project List
              </TabsTrigger>
              <TabsTrigger
                value="Appliedcandidates"
                className="flex-1 text-center"
              >
                Applied Candidates
              </TabsTrigger>
              <TabsTrigger
                value="hirefreelancer"
                className="flex-1 text-center"
              >
                Hire Freelancer
              </TabsTrigger>
            </TabsList>
            <TabsContent value="Personal-Info">
              <PersonalInfo id={id || ""} />
            </TabsContent>
            <TabsContent value="Professional-Info">
              <ProfessionalInfo id={id || ""} />
            </TabsContent>
            <TabsContent value="ProjectList">
              <ProjectList id={id || ""} />
            </TabsContent>
            <TabsContent value="Appliedcandidates">
              <Appliedcandidates id={id || ""} />
            </TabsContent>
            <TabsContent value="hirefreelancer">
              <Hirefreelancer id={id || ""} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};
export default BusinessTabs;
