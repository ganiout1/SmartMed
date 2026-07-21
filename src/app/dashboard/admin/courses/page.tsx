import { createClient } from "@/lib/supabase/server";
import { CourseManagement } from "@/components/admin/course-management";
import { SectionHeader } from "@/components/ui/section-header";

export default async function CoursesPage() {
  const supabase = await createClient();

  // Fetch all courses with counts of lecturers and students
  const { data: courses } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      description,
      course_lecturers (count),
      course_members (count)
    `)
    .order("created_at", { ascending: false });

  // Transform data
  const transformedCourses = (courses || []).map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description || "",
    lecturer_count: c.course_lecturers[0]?.count || 0,
    student_count: c.course_members[0]?.count || 0,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        title="Manajemen Kursus"
        subtitle="Buat kursus baru, edit informasi kursus, dan kelola modul pembelajaran."
      />

      <CourseManagement courses={transformedCourses} />
    </div>
  );
}
