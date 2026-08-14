import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { HistoryAnswersFilter } from "@/components/student/history-answers-filter";

export default async function StudentHistoryDetailPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Fetch Attempt Details
  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select(`
      id, score, completed_at, student_id,
      quizzes (
        id, title, passing_score,
        courses (title)
      )
    `)
    .eq("id", attemptId)
    .single();

  // Ensure attempt exists and belongs to the current user
  if (!attempt || attempt.student_id !== user.id || attempt.completed_at === null) {
    return notFound();
  }

  const quiz = attempt.quizzes as any;
  const isPassed = attempt.score !== null && attempt.score >= quiz.passing_score;

  // 2. Fetch ALL questions for this quiz, then match with student answers
  const quizId = quiz.id;

  const { data: questions } = await supabase
    .from("questions")
    .select("id, question_text, option_a, option_b, option_c, option_d, option_e, correct_option, explanation_text, explanation_image_url, question_image_url")
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: true });

  const { data: rawAnswers } = await supabase
    .from("answers")
    .select("id, question_id, selected_option, is_correct")
    .eq("attempt_id", attemptId);

  // Merge: every question gets an entry, even if the student didn't answer it
  const answers = (questions || []).map((q) => {
    const studentAnswer = (rawAnswers || []).find((a) => a.question_id === q.id);
    return {
      id: studentAnswer?.id || q.id,
      selected_option: studentAnswer?.selected_option || null,
      is_correct: studentAnswer?.is_correct ?? false,
      questions: q,
    };
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-background p-6 rounded-lg border">
        <div>
          <h2 className="text-2xl font-bold">{quiz.title}</h2>
          <p className="text-muted-foreground">{quiz.courses?.title}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Diselesaikan pada: {new Date(attempt.completed_at).toLocaleString("id-ID", {
              day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
            })}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-4xl font-black">{attempt.score}</div>
          <div className="mt-1">
            {isPassed ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Lulus (KKM: {quiz.passing_score})
              </Badge>
            ) : (
              <Badge variant="destructive">
                Tidak Lulus (KKM: {quiz.passing_score})
              </Badge>
            )}
          </div>
        </div>
      </div>

      <HistoryAnswersFilter answers={answers || []} />
    </div>
  );
}
