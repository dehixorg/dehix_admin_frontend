"use client";
import { Search, Settings } from "lucide-react";

import Breadcrumb from "@/components/shared/breadcrumbList";
import { Input } from "@/components/ui/input";
import SidebarMenu, { MenuItem } from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import DropdownProfile from "@/components/shared/DropdownProfile";
import SkillTable from "@/components/Skill/table";
import { menuItemsTop } from "@/config/menuItems/business/dashboardMenuItems";

export default function Dashboard() {
  const menuItemsBottom: MenuItem[] = [
    {
      href: "/settings/personal-info",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
    },
  ];
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Dashboard"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Dashboard"
          />

          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Skill", link: "#" },
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

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Skills Table</h1>
          <SkillTable />
        </div>
      </div>
    </div>
  );
}
