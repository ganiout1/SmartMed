import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

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

  // 2. Fetch Answers and join with Questions
  const { data: answers } = await supabase
    .from("answers")
    .select(`
      id, selected_option, is_correct,
      questions (
        id, question_text, option_a, option_b, option_c, option_d,
        correct_option, explanation_text, explanation_image_url
      )
    `)
    .eq("attempt_id", attemptId)
    .order("created_at", { ascending: true }); // Simplification for display order

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

      <div className="space-y-6 mt-8">
        <h3 className="text-xl font-bold mb-4">Detail Jawaban & Pembahasan</h3>
        
        {(!answers || answers.length === 0) ? (
          <p className="text-center text-muted-foreground py-8">Data jawaban tidak ditemukan.</p>
        ) : (
          answers.map((answer, index) => {
            const q = answer.questions as any;
            if (!q) return null;

            return (
              <Card key={answer.id} className={answer.is_correct ? "border-green-200" : "border-red-200"}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      {answer.is_correct ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex gap-2">
                        <span className="font-bold">{index + 1}.</span>
                        <p className="whitespace-pre-wrap">{q.question_text}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                        {[
                          { label: 'A', text: q.option_a },
                          { label: 'B', text: q.option_b },
                          { label: 'C', text: q.option_c },
                          { label: 'D', text: q.option_d },
                        ].map(opt => {
                          const isStudentChoice = answer.selected_option === opt.label;
                          const isCorrectChoice = q.correct_option === opt.label;
                          
                          let bgClass = "border";
                          if (isCorrectChoice) {
                            bgClass = "bg-green-50 border-green-300 font-medium";
                          } else if (isStudentChoice && !isCorrectChoice) {
                            bgClass = "bg-red-50 border-red-300";
                          }

                          return (
                            <div key={opt.label} className={`p-3 rounded-md ${bgClass} flex items-center justify-between`}>
                              <div>
                                <span className="font-semibold mr-2">{opt.label}.</span>
                                {opt.text}
                              </div>
                              {isStudentChoice && (
                                <Badge variant="outline" className={isCorrectChoice ? "text-green-700" : "text-red-700"}>
                                  Jawaban Anda
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {(q.explanation_text || q.explanation_image_url) && (
                        <div className="mt-6 p-4 bg-muted/30 rounded-lg border ml-6">
                          <p className="font-semibold mb-2 flex items-center gap-2">
                            Pembahasan
                          </p>
                          {q.explanation_text && (
                            <p className="text-sm whitespace-pre-wrap mb-4">{q.explanation_text}</p>
                          )}
                          {q.explanation_image_url && (
                            <div className="relative h-64 w-full max-w-lg rounded-md overflow-hidden border bg-background">
                              <Image 
                                src={q.explanation_image_url} 
                                alt="Gambar Pembahasan" 
                                fill 
                                className="object-contain"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
