"use client"

import * as React from "react"
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
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarMenuButton,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
          url: "#",
        },
        {
          icon: Group,
          title: "Category",
          url: "#",
        },
        {
          icon: Sheet,
          title: "Table",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: SlidersHorizontal,
      items: [
        {
          icon: UserCog,
          title: "User",
          url: "#",
        },
        {
          icon: Settings2,
          title: "Role",
          url: "#",
        },
        {
          icon: Wrench,
          title: "Permission",
          url: "#",
        },
        {
          icon: Settings,
          title: "General Settings",
          url: "#",
        },
      ],
    },],
    navCore: [
          {
            icon: House,
            title: "Dashboard",
            url: "#",
            isActive: true,
          },
          {
            icon: ScanBarcode,
            title: "POS",
            url: "#",
          },
          {
            icon: History,
            title: "Selling History",
            url: "#",
          },
          {
            icon: HandCoins,
            title: "Payment Method",
            url: "#",
          },
          {
            icon: BookCheck,
            title: "Report",
            url: "#",
          },
          {
            icon: TicketPercent,
            title: "Voucher",
            url: "#",
          },
        ],
  };
  

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {data.navCore.map((item, index) => (
          <SidebarMenuButton key={index} tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
          </SidebarMenuButton>
        ))}
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
