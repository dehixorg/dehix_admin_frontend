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
import ProjectTabs from "@/components/project/projectTabs/projectTabs";
import { ProjectCard } from "@/components/project/projectCard/projectCard";

const FreelancerPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // console.log("Retrieved ID:", id);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Project"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Project"
          />

          <Breadcrumb
            items={[
              { label: "Dashboard", link: "" },
              { label: "Project", link: "/project" },
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
          <div>
            <div className="mb-2">{id && <ProjectCard id={id} />}</div>
            <div>
              <ProjectTabs id={id || ""} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default FreelancerPage;
