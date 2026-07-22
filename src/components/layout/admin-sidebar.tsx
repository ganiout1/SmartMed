"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  KeyRound,
  FileSpreadsheet,
  Settings,
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

const adminMenu = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Dosen",
    url: "/dashboard/admin/lecturers",
    icon: Users,
  },
  {
    title: "Mahasiswa",
    url: "/dashboard/admin/students",
    icon: GraduationCap,
  },
  {
    title: "Kursus",
    url: "/dashboard/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Enrollment Keys",
    url: "/dashboard/admin/enrollment-keys",
    icon: KeyRound,
  },
  {
    title: "Penugasan Dosen",
    url: "/dashboard/admin/assignments",
    icon: Settings,
  },
  {
    title: "Hasil Kuis",
    url: "/dashboard/admin/results",
    icon: FileSpreadsheet,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-2">
        <Link href="/dashboard/admin" className="flex items-center justify-center">
          <Image src="/logo.png" alt="SmartMED" width={150} height={45} className="object-contain w-32 h-auto" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenu.map((item) => {
                const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/dashboard/admin");
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
