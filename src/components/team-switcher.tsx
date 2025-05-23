"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import ecoposLogoWhite from "@/assets/ecopos-logo-white.png"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
const containerClass = "h-10 flex flex-wrap gap-4 text-center content-center justify-center bg-primary text-primary-foreground rounded";

export function TeamSwitcher() {
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className={containerClass}>
          <div className="h-10 flex flex-wrap gap-4 text-center content-center justify-center bg-primary text-primary-foreground rounded">
            <img src='/ecopos logo white.png' className="h-6" alt="Ecopos Logo" />
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
