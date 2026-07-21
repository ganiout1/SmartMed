import { createClient } from "@/lib/supabase/server";
import { EnrollmentKeyManagement } from "@/components/admin/enrollment-key-management";
import { SectionHeader } from "@/components/ui/section-header";

export default async function EnrollmentKeysPage() {
  const supabase = await createClient();

  // Fetch all enrollment keys with course details
  const { data: keys } = await supabase
    .from("enrollment_keys")
    .select(`
      id,
      course_id,
      key_code,
      usage_limit,
      usage_count,
      created_at,
      courses (title)
    `)
    .order("created_at", { ascending: false });

  // Fetch courses for dropdown
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .order("title");

  // Transform keys data
  const transformedKeys = (keys || []).map((k: any) => ({
    id: k.id,
    course_id: k.course_id,
    course_title: k.courses?.title || "Unknown Course",
    key_code: k.key_code,
    usage_limit: k.usage_limit,
    usage_count: k.usage_count,
    created_at: k.created_at,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        title="Enrollment Keys"
        subtitle="Buat dan kelola kode akses (enrollment keys) agar mahasiswa dapat mendaftar ke kursus secara mandiri."
      />

      <EnrollmentKeyManagement
        keys={transformedKeys}
        courses={courses || []}
      />
    </div>
  );
}
