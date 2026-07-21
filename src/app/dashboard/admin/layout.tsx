import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Check if user is an admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    // If not admin, maybe redirect to their respective dashboards later
    // For now, just redirect to home or login
    return redirect("/");
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex flex-col flex-1 w-full overflow-hidden">
        <AdminTopbar />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
