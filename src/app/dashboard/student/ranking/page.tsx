import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function StudentRankingIndexPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Fetch current student's completed attempts for Quiz Ranking
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
    .not("completed_at", "is", null);

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

  // 2. Fetch all completed attempts for Global Ranking using Admin Client
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: allAttempts, error: globalError } = await supabaseAdmin
    .from("quiz_attempts")
    .select(`
      student_id,
      quiz_id,
      profiles:student_id (full_name)
    `)
    .not("completed_at", "is", null);

  if (globalError) {
    console.error("Error fetching global attempts:", globalError);
  }

  const globalRankingMap = new Map();
  if (allAttempts) {
    allAttempts.forEach((attempt: any) => {
      const existing = globalRankingMap.get(attempt.student_id) || {
        student_id: attempt.student_id,
        name: attempt.profiles?.full_name || "Unknown Student",
        uniqueQuizzes: new Set(),
      };
      existing.uniqueQuizzes.add(attempt.quiz_id);
      globalRankingMap.set(attempt.student_id, existing);
    });
  }

  const globalLeaderboard = Array.from(globalRankingMap.values()).map(student => ({
    student_id: student.student_id,
    name: student.name,
    count: student.uniqueQuizzes.size,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <SectionHeader
        title="Papan Peringkat (Ranking)"
        subtitle="Pilih kategori untuk melihat peringkat Anda dibandingkan dengan mahasiswa lainnya."
        align="left"
      />

      <Tabs defaultValue="score" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="score" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Berdasarkan Nilai Kuis
          </TabsTrigger>
          <TabsTrigger value="global" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Berdasarkan Jumlah Kuis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-0">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px] text-center font-bold">Peringkat</TableHead>
                  <TableHead className="font-bold">Nama Mahasiswa</TableHead>
                  <TableHead className="text-right font-bold pr-6">Jumlah Kuis Diselesaikan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {globalLeaderboard.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Belum ada data ranking global.
                    </TableCell>
                  </TableRow>
                ) : (
                  globalLeaderboard.map((entry: any, index: number) => {
                    const rank = index + 1;
                    const isCurrentUser = entry.student_id === user.id;
                    
                    let RankBadge = null;
                    if (rank === 1) {
                      RankBadge = <Badge className="bg-yellow-500 hover:bg-yellow-600"><Trophy className="w-3 h-3 mr-1"/> 1st</Badge>;
                    } else if (rank === 2) {
                      RankBadge = <Badge className="bg-gray-400 hover:bg-gray-500"><Medal className="w-3 h-3 mr-1"/> 2nd</Badge>;
                    } else if (rank === 3) {
                      RankBadge = <Badge className="bg-amber-700 hover:bg-amber-800"><Medal className="w-3 h-3 mr-1"/> 3rd</Badge>;
                    } else {
                      RankBadge = <span className="font-semibold text-muted-foreground">#{rank}</span>;
                    }

                    return (
                      <TableRow key={entry.student_id} className={isCurrentUser ? "bg-primary/5 hover:bg-primary/10" : ""}>
                        <TableCell className="text-center">
                          {RankBadge}
                        </TableCell>
                        <TableCell className="font-medium">
                          {entry.name}
                          {isCurrentUser && (
                            <Badge variant="outline" className="ml-2 border-primary text-primary text-[10px]">Anda</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <span className="font-bold text-lg">{entry.count}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="score" className="mt-0">
          {uniqueQuizzes.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/50 mt-4">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-semibold mb-2">Belum Ada Data Ranking</h3>
                <p className="text-muted-foreground max-w-sm">
                  Anda belum menyelesaikan kuis apa pun. Kerjakan kuis terlebih dahulu untuk melihat papan peringkat Anda.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
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
                    <Link href={`/dashboard/student/ranking/${quiz.id}`}>
                      <Button className="w-full" variant="outline">
                        <Trophy className="mr-2 h-4 w-4" />
                        Lihat Leaderboard
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
