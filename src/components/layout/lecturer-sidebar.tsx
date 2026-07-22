"use client";

import Link from "next/link";
import Image from "next/image";
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
      <SidebarHeader className="border-b p-2">
        <Link href="/dashboard/lecturer" className="flex items-center justify-center">
          <Image src="/logo.png" alt="SmartMED" width={150} height={45} className="object-contain w-32 h-auto" />
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
