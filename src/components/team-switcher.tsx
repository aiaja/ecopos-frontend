"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher() {
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="h-10 text-center content-center bg-secondary rounded">
        <h1 className="text-bold text-2xl">ECOPOS</h1>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
