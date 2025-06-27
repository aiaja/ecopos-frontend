import {
  PackagePlus,
  Group,
  Sheet,
  Boxes,
  Settings,
  UserCog,
  Wrench,
  SlidersHorizontal,
  Settings2,
  House,
  ScanBarcode,
  History,
  HandCoins,
  BookCheck,
  TicketPercent,
  LucideIcon,
  Wallet,
  User2,
} from "lucide-react"

// ⬇️ Interface yang bisa di-import dari luar
export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}

export interface SidebarData {
  navMain: NavItem[];
  navCore: NavItem[];
  navSettings: NavItem[];
}

// ⬇️ Default export untuk datanya
const sidebarData: SidebarData = {
  navMain: [
    {
      title: "Inventory",
      url: "#",
      icon: Boxes,
      isActive: true,
      items: [
        {
          icon: PackagePlus,
          title: "Products",
          url: "/inventory/products",
        },
        {
          icon: Group,
          title: "Category",
          url: "/inventory/category",
        },
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: User2,
      items: [
        {
          icon: UserCog,
          title: "User",
          url: "/user-management/user",
        },
        {
          icon: Settings2,
          title: "Role",
          url: "/user-management/role",
        },
        {
          icon: Wrench,
          title: "Permission",
          url: "/user-management/permission",
        },
      ],
    },
  ],
  navCore: [
    {
      icon: House,
      title: "Dashboard",
      url: "/dashboard",
      isActive: true,
    },
    {
      icon: ScanBarcode,
      title: "POS",
      url: "/pos",
    },
    {
      icon: HandCoins,
      title: "Open Bills",
      url: "/open-bills",
    },
    {
      icon: History,
      title: "Selling History",
      url: "/selling-histories",
    },
    {
      icon: Wallet,
      title: "Payment Method",
      url: "/payment-method",
    },
    {
      icon: BookCheck,
      title: "Report",
      url: "/reports",
    },
    {
      icon: TicketPercent,
      title: "Voucher",
      url: "/voucher",
    },
  ],
  navSettings: [
    {
      icon: Settings,
      title: "General Settings",
      url: "/general-settings",
    },
  ],
};

export default sidebarData;
