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
      course_members (count)
    `)
    .eq("role", "student")
    .order("full_name");

  // Transform data
  const users = (students || []).map((s: any) => ({
    id: s.id,
    full_name: s.full_name,
    email: s.email,
    course_count: s.course_members[0]?.count || 0,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        title="Manajemen Mahasiswa"
        subtitle="Kelola akun mahasiswa, tambahkan mahasiswa baru, atau edit profil mahasiswa."
      />

      <UserManagement title="Mahasiswa" role="student" users={users} />
    </div>
  );
}
