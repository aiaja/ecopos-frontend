"use client"

import * as React from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import { logoutService } from "@/services/logout"

import { ItemSidebar } from "./item-sidebar"
import { NavMain } from "./nav-main"
import sidebarData from "@/datas/sidebar"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const data = sidebarData
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const handleLogout = async () => {
    await logoutService()
  }

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon" {...props}>
        {/* Header */}
        <SidebarHeader>
          <div className="flex items-center justify-center p-2">
            {isCollapsed ? (
              <div className="bg-primary rounded-lg flex items-center justify-center w-8 h-8">
                <Image
                  src="/ecopos logo clear.svg"
                  alt="Ecopos Logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="bg-primary rounded-lg flex items-center justify-center w-full h-10 px-3">
                <span className="font-bold text-sm tracking-wide text-primary-foreground">ECOPOS</span>
              </div>
            )}
          </div>
        </SidebarHeader>

        {/* Content */}
        <SidebarContent className={isCollapsed ? "px-1 py-2" : "px-2 py-2"}>
          <SidebarGroup className={isCollapsed ? "gap-1 items-center" : "gap-1"}>
            {/* navCore */}
            {data.navCore.map((item, index) => (
              <ItemSidebar key={index} item={item} isCollapsed={isCollapsed} />
            ))}

            {/* navMain (bisa recursive nanti) */}
            <div className={isCollapsed ? "mt-1" : "mt-2"}>
              <NavMain items={data.navMain} />
            </div>

            {/* navSettings */}
            <div className={isCollapsed ? "mt-1" : "mt-2"}>
              {data.navSettings.map((item, index) => (
                <ItemSidebar key={index} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>
          </SidebarGroup>
        </SidebarContent>

        {/* Logout */}
        <SidebarFooter className={isCollapsed ? "p-1" : "p-2"}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className={`cursor-pointer transition-colors ${
                  isCollapsed
                    ? "h-8 w-8 p-0 justify-center"
                    : "h-9 w-full justify-start gap-3"
                } hover:bg-muted text-sidebar-foreground hover:text-destructive`}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" align="center">
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </SidebarFooter>


        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  )
}
