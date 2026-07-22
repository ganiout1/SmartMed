import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ExamInterface } from "@/components/cbt/exam-interface";

export default async function CBTAttemptPage({
  params,
}: {
  params: Promise<{ quizId: string; attemptId: string }>;
}) {
  const { quizId, attemptId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Validate Attempt
  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select(`
      id, student_id, started_at, completed_at,
      quizzes ( id, title, duration_minutes, status, randomize_questions )
    `)
    .eq("id", attemptId)
    .single();

  if (!attempt || attempt.student_id !== user.id) {
    return notFound();
  }

  const quiz = attempt.quizzes as any;

  // If completed, redirect to result page
  if (attempt.completed_at) {
    return redirect(`/dashboard/student/history/${attempt.id}`);
  }

  // 2. Fetch Questions
  const { data: questions } = await supabase
    .from("questions")
    .select("id, question_text, option_a, option_b, option_c, option_d, explanation_image_url, question_image_url")
    .eq("quiz_id", quiz.id)
    .order("created_at", { ascending: true }); // By default order by creation

  if (!questions || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Tidak ada soal</h2>
          <p className="text-muted-foreground">Kuis ini belum memiliki soal.</p>
        </div>
      </div>
    );
  }

  // If randomize_questions is true, we should shuffle them.
  // Note: Since this is SSR, shuffling here might re-shuffle on refresh. 
  // For a production app, we would store the seed or shuffle order in DB.
  // We will leave it as is for deterministic behavior, or implement a simple seed based on attempt ID.
  let finalQuestions = questions;
  if (quiz.randomize_questions) {
    // Simple pseudo-random shuffle based on attempt ID to keep it consistent on refresh
    const seed = Array.from(attempt.id).reduce((acc: number, char: any) => acc + char.charCodeAt(0), 0);
    const random = (seed: number) => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    
    let currentSeed = seed;
    finalQuestions = [...questions].sort(() => random(currentSeed++) - 0.5);
  }

  // 3. Fetch Existing Answers (for resume capability)
  const { data: answers } = await supabase
    .from("answers")
    .select("question_id, selected_option")
    .eq("attempt_id", attempt.id);

  const initialAnswers: Record<string, string> = {};
  if (answers) {
    answers.forEach(a => {
      if (a.selected_option) {
        initialAnswers[a.question_id] = a.selected_option;
      }
    });
  }

  return (
    <ExamInterface 
      attemptId={attempt.id}
      quizTitle={quiz.title}
      startedAt={attempt.started_at}
      durationMinutes={quiz.duration_minutes}
      questions={finalQuestions}
      initialAnswers={initialAnswers}
    />
  );
}
