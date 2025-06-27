"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation";
import { useEffect } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Set the sidebar to be collapsible if the path is "/tenants/pos"
  const isCollapsible = pathname === "/tenants/pos";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const outletId = localStorage.getItem("outlet_id");
    if (!token || !outletId) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 px-4 bg-light min-h-screen overflow-x-auto">
          <header className="flex h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <SidebarTrigger />
            <div className="flex items-center gap-2 px-4">
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
