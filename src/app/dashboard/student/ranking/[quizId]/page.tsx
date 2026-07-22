import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Medal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function QuizLeaderboardPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // Verify the student has attempted this quiz before showing the leaderboard
  const { data: userAttempt } = await supabase
    .from("quiz_attempts")
    .select("id")
    .eq("quiz_id", quizId)
    .eq("student_id", user.id)
    .eq("status", "completed")
    .limit(1)
    .single();

  if (!userAttempt) {
    // If they haven't completed it, they shouldn't see the ranking
    return redirect("/dashboard/student/ranking");
  }

  // Fetch quiz details
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

  // Fetch all completed attempts for this quiz using Admin Client to get names
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: attempts } = await supabaseAdmin
    .from("quiz_attempts")
    .select(`
      id,
      score,
      student_id,
      completed_at,
      profiles:student_id (full_name)
    `)
    .eq("quiz_id", quizId)
    .eq("status", "completed")
    .order("score", { ascending: false })
    .order("completed_at", { ascending: true }); // Faster completion breaks ties

  // Group by student to keep only their highest score if they attempted multiple times
  const bestAttemptsMap = new Map();
  if (attempts) {
    attempts.forEach((a: any) => {
      const existing = bestAttemptsMap.get(a.student_id);
      if (!existing) {
        bestAttemptsMap.set(a.student_id, a);
      } else {
        // Since it's ordered by score desc, the first one encountered is the highest
        // We do nothing if it already exists
      }
    });
  }

  const leaderboard = Array.from(bestAttemptsMap.values());

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/student/ranking">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <SectionHeader
          title={`Leaderboard: ${quiz.title}`}
          subtitle={quiz.courses?.title || 'Unknown Course'}
          align="left"
        />
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px] text-center font-bold">Peringkat</TableHead>
              <TableHead className="font-bold">Nama Mahasiswa</TableHead>
              <TableHead className="text-center font-bold">Waktu Selesai</TableHead>
              <TableHead className="text-right font-bold pr-6">Nilai Akhir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Belum ada data ranking.
                </TableCell>
              </TableRow>
            ) : (
              leaderboard.map((entry: any, index: number) => {
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
                  <TableRow key={entry.id} className={isCurrentUser ? "bg-primary/5 hover:bg-primary/10" : ""}>
                    <TableCell className="text-center">
                      {RankBadge}
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.profiles?.full_name || "Unknown Student"}
                      {isCurrentUser && (
                        <Badge variant="outline" className="ml-2 border-primary text-primary text-[10px]">Anda</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground text-sm">
                      {entry.completed_at ? new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(entry.completed_at)).replace(/\./g, ':') : "-"}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <span className="font-bold text-lg">{entry.score}</span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
