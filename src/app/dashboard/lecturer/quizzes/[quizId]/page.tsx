import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import { SectionHeader } from "@/components/ui/section-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionManagement } from "@/components/lecturer/question-management";
import { QuizSettings } from "@/components/lecturer/quiz-settings";
import { StudentResults } from "@/components/lecturer/student-results";

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Fetch quiz details and verify access via RLS
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select(`
      *,
      courses (title)
    `)
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) {
    return notFound();
  }

  // 2. Fetch questions
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: true }); // By default order by creation

  // 3. Fetch results (attempts) using Admin Client to bypass RLS on `profiles`
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: attempts } = await supabaseAdmin
    .from("quiz_attempts")
    .select(`
      id,
      score,
      started_at,
      completed_at,
      profiles:student_id (full_name)
    `)
    .eq("quiz_id", quizId)
    .order("started_at", { ascending: false });

  // Transform data
  const transformedQuestions = questions || [];
  
  const transformedAttempts = (attempts || []).map((a: any) => ({
    id: a.id,
    student_name: a.profiles?.full_name || "Unknown Student",
    score: a.score,
    passing_score: quiz.passing_score,
    started_at: a.started_at,
    completed_at: a.completed_at,
    duration_minutes: quiz.duration_minutes,
  }));

  const quizSettings = {
    id: quiz.id,
    duration_minutes: quiz.duration_minutes,
    passing_score: quiz.passing_score,
    status: quiz.status,
    randomize_questions: quiz.randomize_questions,
    randomize_answers: quiz.randomize_answers,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        title={quiz.title}
        subtitle={`Bagian dari kursus: ${quiz.courses?.title || 'Unknown Course'}`}
        align="left"
      />

      <Tabs defaultValue="questions" className="w-full space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="questions">Manajemen Soal</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan Kuis</TabsTrigger>
          <TabsTrigger value="results">Hasil Mahasiswa</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="border-none p-0">
          <QuestionManagement quizId={quiz.id} questions={transformedQuestions} />
        </TabsContent>
        
        <TabsContent value="settings" className="border-none p-0">
          <QuizSettings quiz={quizSettings} />
        </TabsContent>

        <TabsContent value="results" className="border-none p-0">
          <StudentResults results={transformedAttempts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
