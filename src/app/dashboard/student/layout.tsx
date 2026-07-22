import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/layout/student-sidebar";
import { StudentTopbar } from "@/components/layout/student-topbar";

export default async function StudentDashboardLayout({
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

  // Check if user is a student
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "student") {
    return redirect("/");
  }

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset className="flex flex-col flex-1 w-full overflow-hidden">
        <StudentTopbar />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
