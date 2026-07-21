import { createClient } from "@/lib/supabase/server";
import { UserManagement } from "@/components/admin/user-management";
import { SectionHeader } from "@/components/ui/section-header";

export default async function LecturersPage() {
  const supabase = await createClient();

  // Fetch all lecturers
  const { data: lecturers } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      course_lecturers (count)
    `)
    .eq("role", "lecturer")
    .order("full_name");

  // Transform data
  const users = (lecturers || []).map((l: any) => ({
    id: l.id,
    full_name: l.full_name,
    email: l.email,
    course_count: l.course_lecturers[0]?.count || 0,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        title="Manajemen Dosen"
        subtitle="Kelola akun dosen, tambahkan dosen baru, atau hapus dosen dari sistem."
      />

      <UserManagement title="Dosen" role="lecturer" users={users} />
    </div>
  );
}
