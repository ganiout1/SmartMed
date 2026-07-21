import { createClient } from "@/lib/supabase/server";
import { ResultsViewer } from "@/components/admin/results-viewer";
import { SectionHeader } from "@/components/ui/section-header";

export default async function QuizResultsPage() {
  const supabase = await createClient();

  // Fetch all quiz attempts with student, quiz, and course details
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select(`
      id,
      score,
      completed_at,
      profiles:student_id (full_name),
      quizzes:quiz_id (
        title,
        passing_score,
        courses:course_id (title)
      )
    `)
    .order("created_at", { ascending: false });

  // Transform attempts data
  const transformedAttempts = (attempts || []).map((a: any) => ({
    id: a.id,
    student_name: a.profiles?.full_name || "Unknown Student",
    quiz_title: a.quizzes?.title || "Unknown Quiz",
    course_title: a.quizzes?.courses?.title || "Unknown Course",
    score: a.score,
    passing_score: a.quizzes?.passing_score || 0,
    completed_at: a.completed_at,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        title="Hasil Kuis Mahasiswa"
        subtitle="Pantau nilai dan hasil ujian mahasiswa, serta reset percobaan jika diperlukan."
      />

      <ResultsViewer attempts={transformedAttempts} />
    </div>
  );
}
