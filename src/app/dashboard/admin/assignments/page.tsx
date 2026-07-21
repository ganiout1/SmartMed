import { createClient } from "@/lib/supabase/server";
import { AssignmentManagement } from "@/components/admin/assignment-management";
import { SectionHeader } from "@/components/ui/section-header";

export default async function AssignmentsPage() {
  const supabase = await createClient();

  // Fetch all assignments with course and lecturer details
  const { data: assignments } = await supabase
    .from("course_lecturers")
    .select(`
      course_id,
      lecturer_id,
      created_at,
      courses (title),
      profiles (full_name)
    `)
    .order("created_at", { ascending: false });

  // Fetch courses for dropdown
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .order("title");

  // Fetch lecturers for dropdown
  const { data: lecturers } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "lecturer")
    .order("full_name");

  // Transform assignments data
  const transformedAssignments = (assignments || []).map((a: any) => ({
    course_id: a.course_id,
    lecturer_id: a.lecturer_id,
    created_at: a.created_at,
    course_title: a.courses?.title || "Unknown Course",
    lecturer_name: a.profiles?.full_name || "Unknown Lecturer",
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        title="Penugasan Dosen"
        subtitle="Kelola hak akses dosen terhadap kursus tertentu."
      />

      <AssignmentManagement
        assignments={transformedAssignments}
        courses={courses || []}
        lecturers={lecturers || []}
      />
    </div>
  );
}
