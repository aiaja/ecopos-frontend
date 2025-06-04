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
    User2,
  } from "lucide-react"

interface NavItem {
    title: string;
  url: string;
  icon?: LucideIcon; // Ensure this matches the expected type
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    icon?: LucideIcon; // Ensure nested items also use LucideIcon
  }[];
}

interface SidebarData {
    navMain: NavItem[];
    navCore: NavItem[];
    navSettings: NavItem[];
}

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
                    url: "/management/user",
                },
                {
                    icon: Settings2,
                    title: "Role",
                    url: "/management/role",
                },
                {
                    icon: Wrench,
                    title: "Permission",
                    url: "/management/permission",
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
            icon: History,
            title: "Selling History",
            url: "/selling-histories",
        },
        {
            icon: HandCoins,
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
    ]
};

export default sidebarData;