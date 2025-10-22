"use client";

import * as React from "react";
import { IconDashboard } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
        isActive:
          pathname === "/dashboard" || pathname.startsWith("/dashboard/"),
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <img
          src={"/company/javis-logo-dark.png"}
          alt="Logo Javis"
          className="hidden w-12 h-12 dark:block"
        />
        <img
          src={"/company/javis-logo-light.png"}
          alt="Logo Javis"
          className="w-12 h-12 dark:hidden"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
