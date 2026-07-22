import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, HelpCircle, CheckCircle, PlayCircle } from "lucide-react";
import Link from "next/link";

export default async function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Fetch user profile to check tier
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  const isPro = profile?.tier === "pro";

  // 2. Verify student is enrolled in this course (if NOT pro)
  if (!isPro) {
    const { data: enrollment } = await supabase
      .from("course_members")
      .select("course_id")
      .eq("course_id", courseId)
      .eq("student_id", user.id)
      .single();

    if (!enrollment) {
      return notFound();
    }
  }

  // 2. Fetch course details
  const { data: course } = await supabase
    .from("courses")
    .select(`
      id, title, description,
      course_lecturers (
        profiles (full_name)
      )
    `)
    .eq("id", courseId)
    .single();

  if (!course) return notFound();

  // 3. Fetch published quizzes and student's attempts
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select(`
      id, title, description, duration_minutes, passing_score,
      questions (count),
      quiz_attempts (id, score, completed_at)
    `)
    .eq("course_id", courseId)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  // Filter the attempts manually to only include the current student's attempts
  // (In a more complex RLS setup, the join would only return their own attempts automatically, 
  // but it's safe to filter just in case if the RLS on quiz_attempts is not restrictively filtering the joined query)
  const allAttemptsQuery = await supabase
    .from("quiz_attempts")
    .select("id, quiz_id, score, completed_at")
    .eq("student_id", user.id)
    .in("quiz_id", (quizzes || []).map(q => q.id));
  
  const studentAttempts = allAttemptsQuery.data || [];

  const transformedQuizzes = (quizzes || []).map((q: any) => {
    const attemptsForThisQuiz = studentAttempts.filter(a => a.quiz_id === q.id);
    // Find the latest completed attempt
    const completedAttempts = attemptsForThisQuiz.filter(a => a.completed_at !== null);
    const bestScore = completedAttempts.length > 0 
      ? Math.max(...completedAttempts.map(a => a.score || 0)) 
      : null;

    let status = "Belum Dikerjakan";
    if (completedAttempts.length > 0) {
      status = "Sudah Dikerjakan";
    } else if (attemptsForThisQuiz.length > 0) {
      status = "Sedang Dikerjakan";
    }

    return {
      id: q.id,
      title: q.title,
      description: q.description,
      duration_minutes: q.duration_minutes,
      passing_score: q.passing_score,
      question_count: q.questions[0]?.count || 0,
      status,
      bestScore,
    };
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        title={course.title}
        align="left"
      />
      
      {course.description && (
        <p className="text-muted-foreground whitespace-pre-wrap bg-background p-4 rounded-lg border">
          {course.description}
        </p>
      )}

      <h3 className="text-xl font-bold mt-8 mb-4">Daftar Kuis Tersedia</h3>

      {transformedQuizzes.length === 0 ? (
        <div className="text-center py-16 bg-background border rounded-lg">
          <p className="text-muted-foreground">Belum ada kuis yang diterbitkan untuk kursus ini.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {transformedQuizzes.map((quiz) => {
            const isCompleted = quiz.status === "Sudah Dikerjakan";
            const isPassed = isCompleted && quiz.bestScore !== null && quiz.bestScore >= quiz.passing_score;

            return (
              <Card key={quiz.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    {isCompleted ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 shrink-0">
                        Selesai
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600 shrink-0">
                        {quiz.status}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {quiz.description || "Tidak ada deskripsi"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4" />
                      <span>{quiz.question_count} Soal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{quiz.duration_minutes > 0 ? `${quiz.duration_minutes} Menit` : "Tanpa batas"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" />
                      <span>KKM: {quiz.passing_score}</span>
                    </div>
                  </div>

                  {isCompleted && quiz.bestScore !== null && (
                    <div className={`p-3 rounded-md flex justify-between items-center font-medium border ${isPassed ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      <span>Nilai Terbaik:</span>
                      <span className="text-lg">{quiz.bestScore}</span>
                    </div>
                  )}
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button nativeButton={false} render={<Link href={`/cbt/${quiz.id}`}><PlayCircle className="mr-2 h-4 w-4" />Kerjakan Kuis</Link>} className="w-full" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
