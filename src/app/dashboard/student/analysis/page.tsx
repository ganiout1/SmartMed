import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getCategory(score: number, isAttempted: boolean) {
  if (!isAttempted) {
    return {
      label: "Belum Dikerjakan",
      color: "bg-slate-300 dark:bg-slate-700",
      text: "text-muted-foreground",
    };
  }
  if (score <= 19) {
    return {
      label: "Sangat Lemah",
      color: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
    };
  }
  if (score <= 39) {
    return {
      label: "Lemah",
      color: "bg-orange-500",
      text: "text-orange-600 dark:text-orange-400",
    };
  }
  if (score <= 79) {
    return {
      label: "Perlu Latihan",
      color: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-400",
    };
  }
  if (score <= 84) {
    return {
      label: "Kuat",
      color: "bg-green-500",
      text: "text-green-600 dark:text-green-400",
    };
  }
  return {
    label: "Sangat Kuat",
    color: "bg-emerald-600",
    text: "text-emerald-600 dark:text-emerald-400",
  };
}

export default async function StudentAnalysisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch enrolled courses
  const { data: enrollments } = await supabase
    .from("course_members")
    .select("course_id")
    .eq("student_id", user.id);

  const enrolledCourseIds = (enrollments || []).map((e) => e.course_id);

  let courses: any[] = [];
  if (enrolledCourseIds.length > 0) {
    const { data } = await supabaseAdmin
      .from("courses")
      .select(`
        id,
        title,
        quizzes (
          id,
          title,
          status
        )
      `)
      .in("id", enrolledCourseIds)
      .order("title");
    
    if (data) courses = data;
  }

  // Filter out unpublished quizzes
  courses = courses.map(c => ({
    ...c,
    quizzes: (c.quizzes || []).filter((q: any) => q.status === "published").sort((a: any, b: any) => a.title.localeCompare(b.title))
  }));

  // Fetch attempts to get highest score
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("quiz_id, score")
    .eq("student_id", user.id)
    .not("score", "is", null);

  const bestScores = new Map<string, number>();
  if (attempts) {
    attempts.forEach((a) => {
      const current = bestScores.get(a.quiz_id) || -1;
      const score = a.score || 0;
      if (score > current) {
        bestScores.set(a.quiz_id, score);
      }
    });
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-8">
      <SectionHeader
        title="Analisis Per Kursus"
        subtitle="Pantau tingkat pemahaman Anda pada tiap topik di dalam kursus."
      />

      {courses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg bg-background">
          Anda belum terdaftar di kursus manapun.
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => {
            const hasQuizzes = course.quizzes && course.quizzes.length > 0;
            
            return (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 border-b pb-4">
                  <CardTitle className="text-lg">Analisis {course.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {!hasQuizzes ? (
                    <p className="text-sm text-muted-foreground">Belum ada kuis yang tersedia di kursus ini.</p>
                  ) : (
                    <div className="space-y-5">
                      {course.quizzes.map((quiz: any) => {
                        const isAttempted = bestScores.has(quiz.id);
                        const score = isAttempted ? (bestScores.get(quiz.id) || 0) : 0;
                        const cat = getCategory(score, isAttempted);
                        
                        // Using max 2 for width so there's always a tiny visible colored circle/bar for 0%
                        const widthPercent = Math.max(score, 2);

                        return (
                          <div key={quiz.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div className="w-full sm:w-48 shrink-0 font-medium text-sm">
                              {quiz.title}
                            </div>
                            <div className="flex-1 flex items-center gap-4">
                              <div className="flex-1 bg-secondary h-4 rounded-full overflow-hidden flex items-center">
                                <div 
                                  className={`h-4 rounded-full ${cat.color} transition-all duration-1000 ease-out`} 
                                  style={{ width: `${widthPercent}%` }}
                                />
                              </div>
                              <div className="w-32 shrink-0 flex items-center justify-end gap-2 text-sm font-semibold">
                                <span>{isAttempted ? `${score}%` : "0%"}</span>
                                <span className={`text-xs ${cat.text} w-24 text-right hidden md:inline-block`}>
                                  {cat.label}
                                </span>
                              </div>
                            </div>
                            <span className={`text-xs ${cat.text} mt-1 sm:hidden`}>
                              {cat.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
