"use client";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";
import { Input } from "@/components/ui/input";
import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import {
  menuItemsTop,
  menuItemsBottom,
} from "@/config/menuItems/admin/dashboardMenuItems";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfo from "@/components/freelancer/freelancer-info/tabs/personalInfo/personalInfo";
import SkillDomain from "@/components/freelancer/freelancer-info/tabs/skillDomain/skillDomain";
import Project from "@/components/freelancer/freelancer-info/tabs/project/project";
import OracleProject from "@/components/freelancer/freelancer-info/tabs/oracleProject/oracleProject";

const FreelancerPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // console.log("Retrieved ID:", id);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Freelancer"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Freelancer"
          />

          <Breadcrumb
            items={[
              { label: "Dashboard", link: "" },
              { label: "Freelancer", link: "/freelancer/table" },
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="Personal-Info">Personal-Info</TabsTrigger>
              <TabsTrigger value="Project">Projects</TabsTrigger>
              <TabsTrigger value="Oracle-Project">Oracle-Project</TabsTrigger>
              <TabsTrigger value="Skill-Domain">Skill/Domain</TabsTrigger>
            </TabsList>
            <TabsContent value="Personal-Info">
              <PersonalInfo id={id || ""} />
            </TabsContent>
            <TabsContent value="Project">
              <Project id={id || ""} />
            </TabsContent>
            <TabsContent value="Oracle-Project">
              <OracleProject id={id || ""} />
            </TabsContent>
            <TabsContent value="Skill-Domain">
              <SkillDomain id={id || ""} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};
export default FreelancerPage;
