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
                    url: "/tenants/inventory/products",
                },
                {
                    icon: Group,
                    title: "Category",
                    url: "/tenants/inventory/category",
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
                    url: "/tenants/user-management/user",
                },
                {
                    icon: Settings2,
                    title: "Role",
                    url: "/tenants/user-management/role",
                },
                {
                    icon: Wrench,
                    title: "Permission",
                    url: "/tenants/user-management/permission",
                },
            ],
        },
    ],
    navCore: [
        {
            icon: House,
            title: "Dashboard",
            url: "/tenants/home",
            isActive: true,
        },
        {
            icon: ScanBarcode,
            title: "POS",
            url: "/tenants/pos",
        },
        {
            icon: History,
            title: "Selling History",
            url: "/tenants/selling-history",
        },
        {
            icon: HandCoins,
            title: "Payment Method",
            url: "/tenants/payment-method",
        },
        {
            icon: BookCheck,
            title: "Report",
            url: "/tenants/reports",
        },
        {
            icon: TicketPercent,
            title: "Voucher",
            url: "/tenants/voucher",
        },
    ],
    navSettings: [
        {
            icon: Settings,
            title: "General Settings",
            url: "/tenants/general-settings",
        },
    ]
};

export default sidebarData;