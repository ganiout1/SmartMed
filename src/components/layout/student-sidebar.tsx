"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  User,
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

const studentMenu = [
  {
    title: "Dashboard",
    url: "/dashboard/student",
    icon: LayoutDashboard,
  },
  {
    title: "Riwayat Kuis",
    url: "/dashboard/student/history",
    icon: History,
  },
  {
    title: "Profile",
    url: "/dashboard/student/profile",
    icon: User,
  },
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-2">
        <Link href="/dashboard/student" className="flex items-center justify-center">
          <Image src="/logo.png" alt="SmartMED" width={150} height={45} className="object-contain w-32 h-auto" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Mahasiswa</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {studentMenu.map((item) => {
                const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/dashboard/student");
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
