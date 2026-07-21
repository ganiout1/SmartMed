"use client";

import Link from "next/link";
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
      <SidebarHeader className="border-b p-4">
        <Link href="/dashboard/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">SmartMed CBT</span>
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
