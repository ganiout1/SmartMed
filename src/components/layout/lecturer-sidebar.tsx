"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const lecturerMenu = [
  {
    title: "Dashboard",
    url: "/dashboard/lecturer",
    icon: LayoutDashboard,
  },
  {
    title: "Kursus Saya",
    url: "/dashboard/lecturer/courses",
    icon: BookOpen,
  },
];

export function LecturerSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/dashboard/lecturer" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">SmartMed CBT</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Dosen</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {lecturerMenu.map((item) => {
                const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/dashboard/lecturer");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      isActive={isActive}
                      render={
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
