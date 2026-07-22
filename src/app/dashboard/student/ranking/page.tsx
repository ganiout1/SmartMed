import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

export default async function StudentRankingIndexPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // Fetch all completed attempts for this student
  const { data: attempts, error } = await supabase
    .from("quiz_attempts")
    .select(`
      quiz_id,
      quizzes (
        id,
        title,
        courses (title)
      )
    `)
    .eq("student_id", user.id)
    .eq("status", "completed");

  if (error) {
    console.error("Error fetching attempts for ranking:", error);
  }

  // Get unique quizzes
  const uniqueQuizzesMap = new Map();
  if (attempts) {
    attempts.forEach((attempt: any) => {
      if (attempt.quizzes && !uniqueQuizzesMap.has(attempt.quiz_id)) {
        uniqueQuizzesMap.set(attempt.quiz_id, attempt.quizzes);
      }
    });
  }

  const uniqueQuizzes = Array.from(uniqueQuizzesMap.values());

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SectionHeader
        title="Ranking Kuis"
        subtitle="Lihat peringkat Anda dibandingkan mahasiswa lain pada kuis yang telah Anda selesaikan."
        align="left"
      />

      {uniqueQuizzes.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Data Ranking</h3>
            <p className="text-muted-foreground max-w-sm">
              Anda belum menyelesaikan kuis apa pun. Kerjakan kuis terlebih dahulu untuk melihat papan peringkat Anda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {uniqueQuizzes.map((quiz: any) => (
            <Card key={quiz.id} className="hover:border-primary/50 transition-colors shadow-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs font-medium text-primary uppercase tracking-wider line-clamp-1">
                  {quiz.courses?.title || "Unknown Course"}
                </CardDescription>
                <CardTitle className="text-lg leading-tight line-clamp-2">
                  {quiz.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/dashboard/student/ranking/${quiz.id}`}>
                    <Trophy className="mr-2 h-4 w-4" />
                    Lihat Leaderboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
