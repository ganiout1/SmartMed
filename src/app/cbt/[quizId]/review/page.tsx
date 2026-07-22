import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function QuizReviewPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Fetch Quiz Data
  const { data: quizResponse } = await supabase
    .from("quizzes")
    .select(`
      id, title, description, passing_score, course_id,
      courses (title)
    `)
    .eq("id", quizId)
    .single();

  if (!quizResponse) return notFound();
  const quiz = quizResponse as any;

  // 2. Fetch Latest Completed Attempt
  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("id, score, completed_at")
    .eq("quiz_id", quizId)
    .eq("student_id", user.id)
    .not("completed_at", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!attempt) {
    // If no completed attempt, they shouldn't be here
    return redirect(`/cbt/${quizId}`);
  }

  // 3. Fetch Questions and Answers
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: true });

  const { data: answers } = await supabase
    .from("answers")
    .select("*")
    .eq("attempt_id", attempt.id);

  const isPassed = attempt.score !== null && attempt.score >= quiz.passing_score;

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <Button nativeButton={false} render={<Link href={`/cbt/${quiz.id}`}><ArrowLeft className="mr-2 h-4 w-4" /> Kembali</Link>} variant="outline" />
          <h1 className="text-xl font-bold">Hasil & Pembahasan</h1>
          <div className="w-[100px]" /> {/* Spacer for centering */}
        </div>

        {/* Score Summary */}
        <Card className="border-t-4 border-t-primary shadow-md">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <CardDescription>{quiz.courses?.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`p-6 rounded-lg text-center flex flex-col items-center justify-center space-y-2 border ${isPassed ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
              <span className="text-sm font-medium uppercase tracking-wider opacity-80">Nilai Akhir</span>
              <span className="text-5xl font-black">{attempt.score}</span>
              <Badge variant="outline" className={`mt-2 text-sm ${isPassed ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'}`}>
                {isPassed ? 'LULUS (Memenuhi KKM)' : 'TIDAK LULUS (Di Bawah KKM)'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Questions & Explanations */}
        <div className="space-y-6 pt-4">
          <h2 className="text-xl font-bold">Review Soal</h2>
          
          {(questions || []).map((q, index) => {
            const answer = (answers || []).find(a => a.question_id === q.id);
            const isCorrect = answer?.is_correct || false;
            const selectedOption = answer?.selected_option || null;

            return (
              <Card key={q.id} className={`overflow-hidden border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardContent className="p-6">
                  {/* Question Header */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex gap-2">
                      <span className="font-bold">{index + 1}.</span>
                      <p className="whitespace-pre-wrap font-medium">{q.question_text}</p>
                    </div>
                    {isCorrect ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 shrink-0">
                        <CheckCircle className="w-3 h-3 mr-1" /> Benar
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 shrink-0">
                        <XCircle className="w-3 h-3 mr-1" /> Salah
                      </Badge>
                    )}
                  </div>

                  {q.question_image_url && (
                    <div className="mb-6 relative w-full max-w-2xl h-64 md:h-80 rounded-md overflow-hidden bg-muted/20">
                      <Image
                        src={q.question_image_url}
                        alt="Gambar Soal"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6 mb-6">
                    {['A', 'B', 'C', 'D'].map((opt) => {
                      const optionText = q[`option_${opt.toLowerCase()}` as keyof typeof q];
                      const isThisSelected = selectedOption === opt;
                      const isThisCorrect = q.correct_option === opt;

                      let boxClass = "p-3 rounded-md border flex items-center justify-between";
                      if (isThisCorrect) {
                        boxClass += " bg-green-50 border-green-300 font-medium text-green-900"; // Always highlight correct answer
                      } else if (isThisSelected && !isThisCorrect) {
                        boxClass += " bg-red-50 border-red-300 text-red-900"; // Highlight wrong selected answer
                      } else {
                        boxClass += " bg-background text-muted-foreground";
                      }

                      return (
                        <div key={opt} className={boxClass}>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{opt}.</span>
                            <span>{String(optionText)}</span>
                          </div>
                          {isThisCorrect && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {isThisSelected && !isThisCorrect && <XCircle className="w-4 h-4 text-red-600" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Section */}
                  <div className="pl-6">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5">
                      <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                        Pembahasan Soal
                      </h4>
                      
                      {(!q.explanation_text && !q.explanation_image_url) ? (
                        <p className="text-sm text-muted-foreground italic">Dosen belum menambahkan pembahasan untuk soal ini.</p>
                      ) : (
                        <div className="space-y-4">
                          {q.explanation_text && (
                            <p className="text-sm text-foreground whitespace-pre-wrap">{q.explanation_text}</p>
                          )}
                          
                          {q.explanation_image_url && (
                            <div className="relative w-full max-w-lg h-64 border rounded-md overflow-hidden bg-white">
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
          })}
        </div>
      </div>
    </div>
  );
}
