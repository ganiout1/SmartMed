import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { LecturerSidebar } from "@/components/layout/lecturer-sidebar";
import { LecturerTopbar } from "@/components/layout/lecturer-topbar";

export default async function LecturerDashboardLayout({
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

  // Check if user is a lecturer
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "lecturer") {
    return redirect("/");
  }

  return (
    <SidebarProvider>
      <LecturerSidebar />
      <SidebarInset className="flex flex-col flex-1 w-full overflow-hidden">
        <LecturerTopbar />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
