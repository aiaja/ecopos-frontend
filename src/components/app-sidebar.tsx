"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarMenuButton,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import sidebarData from "@/datas/sidebar"

// This is sample data

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = sidebarData
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {data.navCore.map((item, index) => (
          <a href={item.url} key={index}>    
          <SidebarMenuButton key={index} tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
          </SidebarMenuButton>
          </a>
        ))}
        <NavMain items={data.navMain} />
        {data.navSettings.map((item, index) => (
          <a href={item.url} key={index}>    
          <SidebarMenuButton key={index} tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
          </SidebarMenuButton>
          </a>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
