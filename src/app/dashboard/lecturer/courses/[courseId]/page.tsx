import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { SectionHeader } from "@/components/ui/section-header";
import { QuizManagement } from "@/components/lecturer/quiz-management";

export default async function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Verify lecturer has access to this course
  const { data: assignment } = await supabase
    .from("course_lecturers")
    .select("course_id")
    .eq("course_id", params.courseId)
    .eq("lecturer_id", user.id)
    .single();

  if (!assignment) {
    return notFound(); // Lecturer is not assigned to this course
  }

  // 2. Fetch course details
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", params.courseId)
    .single();

  if (!course) return notFound();

  // 3. Fetch quizzes for this course
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select(`
      id,
      title,
      description,
      duration_minutes,
      passing_score,
      status,
      questions (count),
      quiz_attempts (count)
    `)
    .eq("course_id", params.courseId)
    .order("created_at", { ascending: false });

  // Transform quizzes data
  const transformedQuizzes = (quizzes || []).map((q: any) => ({
    id: q.id,
    title: q.title,
    description: q.description || "",
    duration_minutes: q.duration_minutes || 0,
    passing_score: q.passing_score || 0,
    status: q.status || "draft",
    question_count: q.questions[0]?.count || 0,
    attempt_count: q.quiz_attempts[0]?.count || 0,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        title={course.title}
        subtitle={course.description || "Manajemen materi kuis dan soal untuk kursus ini."}
        align="left"
      />

      <QuizManagement courseId={params.courseId} quizzes={transformedQuizzes} />
    </div>
  );
}
