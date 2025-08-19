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
  ShieldCheck,
  StickyNote,
  Home,
  Archive,
  Trash2,
  FileWarning,
  Link,
  Network,
  Receipt,
  Banknote,
  Key,
  Briefcase
  
  
} from "lucide-react";

import { MenuItem } from "@/components/menu/sidebarMenu";

export const menuItemsTop: MenuItem[] = [
  {
    href: "#",
    icon: <Boxes className="h-6 w-6 transition-all group-hover:scale-110" />,
    label: "Dehix",
  },
  {
    href: "/business",
    icon: <BriefcaseBusiness className="h-6 w-6" />,
    label: "Business",
  },
  {
    href: "/freelancer",
    icon: <User className="h-6 w-6" />,
    label: "Freelancer",
  },
  {
    // Merged item for Connects and Transactions
    href: "#",
    icon: <Briefcase className="h-6 w-6" />,
    label: "",
    subItems: [
      {
        href: "/connects",
        icon: <Banknote className="h-5 w-5" />,
        label: "Connects",
      },
      {
        href: "/transactions",
        icon: <Receipt className="h-5 w-5" />,
        label: "Transactions",
      },
    ],
  },
  {
    // Merged item for Skill and Domain
    href: "#",
    icon: <FileBadge className="h-6 w-6" />,
    label: "",
    subItems: [
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
    ],
  },
  {
    href: "/notification",
    icon: <BellRing className="h-6 w-6" />,
    label: "Notification",
  },
  {
    href: "/faq",
    icon: <MessageSquareMore className="h-6 w-6" />,
    label: "Faq",
  },
  {
    href: "/project",
    icon: <FolderLock className="h-6 w-6" />,
    label: "Project",
  },
  {
    href: "/admin",
    icon: <EarthLock className="h-6 w-6" />,
    label: "Admin",
  },
  {
    href: "/interview",
    icon: <NotebookPen className="h-6 w-6" />,
    label: "Interview",
  },
  {
    href: "/bid",
    icon: <Gavel className="h-6 w-6" />,
    label: "Bid",
  },
  {
    href: "/projectdomain",
    icon: <UserCheck className="h-6 w-6" />,
    label: "Project Domain",
  },
  {
    // Merged item for Verification
    href: "/verification",
    icon: <Key className="h-6 w-6" />,
    label: "",
    subItems: [
      {
        href: "/verification",
        icon: <ShieldCheck className="h-5 w-5" />,
        label: "Verification",
      },
      {
        href: "/adminVerification",
        icon: <ShieldCheck className="h-5 w-5" />,
        label: " Admin Verification",
      },
    ],
  },
  {
    href: "/notes",
    icon: <StickyNote className="h-6 w-6" />,
    label:"Notes",
  },
  {
    href: "/reports",
    icon: <FileWarning className="h-6 w-6" />,
    label:"Reports",
  }
];

export const menuItemsBottom: MenuItem[] = [
  {
    href: "/settings",
    icon: <Settings className="h-6 w-6" />,
    label: "Settings",
  },
];

export const notesMenu: MenuItem[] = [
  {
    href: '#',
    icon: <Boxes className="h-6 w-6 transition-all group-hover:scale-110" />,
    label: 'Dehix',
  },
  {
    href: '/business',
    icon: <Home className="h-6 w-6" />,
    label: 'Home'
  },
  {
    href: '/notes',
    icon: <StickyNote className="h-6 w-6" />,
    label: 'Notes',
  },
  {
    href: '/notes/archive',
    icon: <Archive className="h-6 w-6" />,
    label: 'Archive'
  },
  {
    href: '/notes/trash',
    icon: <Trash2 className="h-6 w-6" />,
    label: 'Trash'
  },
  {
    href: '/notes/mynotes',
    icon: <NotebookPen className="h-6 w-6" />,
    label: 'MyNotes'
  }
];