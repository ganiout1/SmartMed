import { createClient } from "@/lib/supabase/server";
import { UserManagement } from "@/components/admin/user-management";
import { SectionHeader } from "@/components/ui/section-header";

export default async function StudentsPage() {
  const supabase = await createClient();

  // Fetch all students
  const { data: students } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      tier,
      is_banned,
      course_members (count)
    `)
    .eq("role", "student")
    .order("full_name");

  // Transform data
  const users = (students || []).map((s: any) => ({
    id: s.id,
    full_name: s.full_name,
    email: s.email,
    tier: s.tier,
    is_banned: s.is_banned,
    course_count: s.course_members[0]?.count || 0,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="Manajemen Pengguna"
        subtitle="Kelola akun pengguna, atur status langganan (Pro/Biasa), dan tangguhkan akun jika diperlukan."
      />

      <UserManagement title="Mahasiswa" role="student" users={users} />
    </div>
  );
}
