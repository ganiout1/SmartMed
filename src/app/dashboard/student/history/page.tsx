import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye } from "lucide-react";

export default async function StudentHistoryPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const searchQuery = searchParams.q || "";

  // Fetch quiz attempts with related quiz and course info
  let query = supabase
    .from("quiz_attempts")
    .select(`
      id,
      score,
      started_at,
      completed_at,
      quizzes (
        title,
        passing_score,
        courses (title)
      )
    `)
    .eq("student_id", user.id)
    .not("completed_at", "is", null) // Only show completed attempts
    .order("completed_at", { ascending: false });

  // Currently Supabase ilike on related tables is tricky without an RPC,
  // so we'll fetch all completed and filter in memory for simplicity if search is applied.
  const { data: attempts } = await query;

  const transformedAttempts = (attempts || [])
    .map((a: any) => ({
      id: a.id,
      quiz_title: a.quizzes?.title || "Unknown Quiz",
      course_title: a.quizzes?.courses?.title || "Unknown Course",
      score: a.score,
      passing_score: a.quizzes?.passing_score || 0,
      completed_at: a.completed_at,
    }))
    .filter((a) => {
      if (!searchQuery) return true;
      const lowerQuery = searchQuery.toLowerCase();
      return (
        a.quiz_title.toLowerCase().includes(lowerQuery) ||
        a.course_title.toLowerCase().includes(lowerQuery)
      );
    });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        title="Riwayat Kuis"
        subtitle="Lihat rekaman nilai dan pembahasan dari kuis yang telah Anda selesaikan."
        align="left"
      />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <form className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Cari nama kuis atau kursus..."
            className="pl-8"
            defaultValue={searchQuery}
          />
        </form>
      </div>

      <div className="rounded-md border overflow-hidden bg-background">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nama Kuis</TableHead>
              <TableHead>Kursus</TableHead>
              <TableHead>Tanggal Selesai</TableHead>
              <TableHead className="text-center">Nilai</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transformedAttempts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  {searchQuery 
                    ? "Tidak ada riwayat kuis yang cocok dengan pencarian Anda."
                    : "Anda belum menyelesaikan kuis apapun."}
                </TableCell>
              </TableRow>
            ) : (
              transformedAttempts.map((attempt) => {
                const isPassed = attempt.score !== null && attempt.score >= attempt.passing_score;

                return (
                  <TableRow key={attempt.id}>
                    <TableCell className="font-medium">{attempt.quiz_title}</TableCell>
                    <TableCell className="text-muted-foreground">{attempt.course_title}</TableCell>
                    <TableCell>
                      {new Date(attempt.completed_at).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-center font-mono text-lg font-bold">
                      {attempt.score}
                    </TableCell>
                    <TableCell className="text-center">
                      {isPassed ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Lulus
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Tidak Lulus</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button render={
                        <Link href={`/dashboard/student/history/${attempt.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> Detail
                        </Link>
                      } variant="outline" size="sm" />
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
