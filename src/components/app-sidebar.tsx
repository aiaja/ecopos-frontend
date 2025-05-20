"use client"

import * as React from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
// import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarMenuButton,
  SidebarHeader,
  SidebarGroup,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import sidebarData from "@/datas/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = sidebarData;
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  function isActive(url: string) {
    return url !== "#" && pathname.startsWith(url);
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <div
        className="sticky top-0 z-20 bg-sidebar h-14 flex items-center justify-center p-[15px] py-8 border-b border-sidebar-border"
      >
        {isCollapsed ? (
          <div className="bg-primary rounded-lg flex items-center justify-center w-12 h-12">
            <Image src="/ecopos logo clear.svg" alt="Ecopos Logo" width={28} height={28} className="object-contain" />
          </div>
        ) : (
          <div className="bg-primary rounded-lg flex items-center justify-center w-full h-full min-h-[48px] min-w-[96px]">
            <span className="font-bold text-lg tracking-wide text-primary-foreground">ECOPOS</span>
          </div>
        )}
      </div>
      <SidebarContent className="pt-2">
        <SidebarGroup className="gap-0.5">
          {/* navCore */}
          {data.navCore.map((item, index) => (
            <a href={item.url} key={index}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive(item.url)}
                className="mb-1"
              >
                {item.icon && <item.icon />}
                {!isCollapsed && <span>{item.title}</span>}
              </SidebarMenuButton>
            </a>
          ))}
          <NavMain items={data.navMain} />
          {/* navSettings */}
          {data.navSettings.map((item, index) => (
            <a href={item.url} key={index}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive(item.url)}
                className="mb-1"
              >
                {item.icon && <item.icon />}
                {!isCollapsed && <span>{item.title}</span>}
              </SidebarMenuButton>
            </a>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
