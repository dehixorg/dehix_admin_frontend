import {
  Boxes,
  User,
  Settings,
  FileBadge,
  Earth,
  EarthLock,
  BriefcaseBusiness,
  BellRing,
  MessageSquareMore,
  FolderLock,
  Gavel,
  NotebookPen,
  UserCheck,
  ShieldCheck
} from "lucide-react";

import { MenuItem } from "@/components/menu/sidebarMenu";

export const menuItemsTop: MenuItem[] = [
  {
    href: "#",
    icon: <Boxes className="h-4 w-4 transition-all group-hover:scale-110" />,
    label: "Dehix",
  },
  {
    href: "/business",
    icon: <BriefcaseBusiness className="h-5 w-5" />,
    label: "Business",
  },
  {
    href: "/freelancer",
    icon: <User className="h-5 w-5" />,
    label: "Freelancer",
  },
  {
    href: "/skill",
    icon: <FileBadge className="h-5 w-5" />,
    label: "Skill",
  },
  {
    href: "/domain",
    icon: <Earth className="h-5 w-5" />,
    label: "Domain",
  },
  {
    href: "/notification",
    icon: <BellRing className="h-5 w-5" />,
    label: "Notification",
  },
  {
    href: "/faq",
    icon: <MessageSquareMore className="h-5 w-5" />,
    label: "Faq",
  },
  {
    href: "/project",
    icon: <FolderLock className="h-5 w-5" />,
    label: "Project",
  },
  {
    href: "/admin",
    icon: <EarthLock className="h-5 w-5" />,
    label: "Admin",
  },
  {
    href: "/interview",
    icon: <NotebookPen className="h-5 w-5" />,
    label: "Interview",
  },

  {
    href: "/bid",
    icon: <Gavel className="h-5 w-5" />,
    label: "Bid",
  },

  {
    href: "/projectdomain",
    icon: <UserCheck className="h-5 w-5" />,
    label: "Project Domain",
  },
  {
    href: "/verification",
    icon: <ShieldCheck className="h-5 w-5" />,
    label: "Verification",
  },
];

export const menuItemsBottom: MenuItem[] = [
  {
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    label: "Settings",
  },
];
