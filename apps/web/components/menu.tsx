"use client";

import { Activity, Heart, Home, Moon, SportShoe, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const TABS = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/recovery", icon: Heart, label: "Recovery" },
  { href: "/dashboard/sleep", icon: Moon, label: "Sleep" },
  { href: "/dashboard/cycles", icon: Activity, label: "Cycles" },
  { href: "/dashboard/workouts", icon: SportShoe, label: "Workouts" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
] as const;

export const Menu = () => {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <h1 className="block shrink-0 uppercase">Whoopy</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {TABS.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <SidebarMenuItem key={tab.label}>
                    <SidebarMenuButton
                      tooltip={tab.label}
                      isActive={isActive}
                      render={<Link href={tab.href} />}
                    >
                      <tab.icon className="size-5" />
                      <span>{tab.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
