"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import type { NavItem } from "@/datas/sidebar"

interface ItemSidebarProps {
  item: NavItem
  isCollapsed: boolean
}

export function ItemSidebar({ item, isCollapsed }: ItemSidebarProps) {
  const pathname = usePathname()
  const isActive = item.url !== "#" && pathname.startsWith(item.url)

  const ButtonContent = (
    <Link href={item.url} className="block">
      <SidebarMenuButton
        tooltip={isCollapsed ? item.title : undefined}
        isActive={isActive}
        className={`cursor-pointer transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
          isCollapsed
            ? "h-8 w-8 p-0 justify-center rounded-md"
            : "h-9 w-full justify-start gap-3 rounded-md"
        }`}
      >
        {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
        {!isCollapsed && <span className="truncate">{item.title}</span>}
      </SidebarMenuButton>
    </Link>
  )

  // Kalau collapsed, bungkus pakai Tooltip
  return isCollapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>{ButtonContent}</TooltipTrigger>
      <TooltipContent side="right" align="center">
        {item.title}
      </TooltipContent>
    </Tooltip>
  ) : (
    ButtonContent
  )
}
