import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, HelpCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StartQuizButton } from "@/components/cbt/start-quiz-button";

export default async function CBTStartPage({
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
      id, title, description, duration_minutes, passing_score, status, course_id, max_attempts,
      questions (count),
      courses (title)
    `)
    .eq("id", quizId)
    .single();

  if (!quizResponse) return notFound();
  
  const quiz = quizResponse as any;

  // 1b. Fetch user profile to check tier
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();
  const isPro = profile?.tier === "pro";

  // 2. Validate Membership
  let hasAccess = isPro;
  if (!isPro) {
    const { data: membership } = await supabase
      .from("course_members")
      .select("course_id")
      .eq("course_id", quiz.course_id)
      .eq("student_id", user.id)
      .single();
    if (membership) hasAccess = true;
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Akses Ditolak</AlertTitle>
          <AlertDescription>
            Anda tidak terdaftar di kursus ini. Silakan bergabung dengan kursus terlebih dahulu menggunakan Enrollment Key.
          </AlertDescription>
          <Button nativeButton={false} render={<Link href="/dashboard/student/courses">Kembali ke Kursus</Link>} variant="outline" className="mt-4 w-full" />
        </Alert>
      </div>
    );
  }

  // 3. Validate Published Status
  if (quiz.status !== "published") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Kuis Belum Tersedia</AlertTitle>
          <AlertDescription>
            Kuis ini belum diterbitkan oleh Dosen pengampu.
          </AlertDescription>
          <Button nativeButton={false} render={<Link href={`/dashboard/student/courses/${quiz.course_id}`}>Kembali</Link>} variant="outline" className="mt-4 w-full" />
        </Alert>
      </div>
    );
  }

  // 4. Validate Attempts
  const { data: existingAttempts } = await supabase
    .from("quiz_attempts")
    .select("id, completed_at")
    .eq("quiz_id", quizId)
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  const completedAttemptsCount = (existingAttempts || []).filter(a => a.completed_at !== null).length;
  const hasActiveAttempt = (existingAttempts || []).find(a => a.completed_at === null);
  const maxAttemptsReached = quiz.max_attempts !== null && completedAttemptsCount >= quiz.max_attempts;

  const questionCount = quiz.questions[0]?.count || 0;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 py-12">
      <Card className="max-w-2xl w-full shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center pb-8 border-b">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">{quiz.title}</CardTitle>
          <CardDescription className="text-base mt-2">
            Bagian dari kursus: <span className="font-semibold text-foreground">{quiz.courses?.title}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="py-8 space-y-8">
          {quiz.description && (
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-muted-foreground whitespace-pre-wrap">{quiz.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
                <HelpCircle className="h-4 w-4" /> Soal
              </p>
              <p className="text-xl font-bold">{questionCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
                <Clock className="h-4 w-4" /> Durasi
              </p>
              <p className="text-xl font-bold">{quiz.duration_minutes > 0 ? `${quiz.duration_minutes} Menit` : 'Tanpa batas'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Target (KKM)</p>
              <p className="text-xl font-bold">{quiz.passing_score}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Batas Percobaan</p>
              <p className="text-xl font-bold">{quiz.max_attempts ? `${quiz.max_attempts} Kali` : 'Tak Terbatas'}</p>
            </div>
          </div>

          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
            <AlertTriangle className="h-4 w-4 stroke-red-900" />
            <AlertTitle>Perhatian Sebelum Memulai</AlertTitle>
            <AlertDescription className="text-sm opacity-90">
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>Waktu ujian akan terus berjalan meskipun Anda menutup jendela browser.</li>
                <li>Sistem akan otomatis mengirimkan (submit) jawaban Anda jika waktu habis.</li>
                <li>Pastikan koneksi internet Anda stabil.</li>
                <li>Dilarang melakukan kecurangan dalam bentuk apapun.</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t p-6 bg-muted/20">
          <Button nativeButton={false} render={<Link href={`/dashboard/student/courses/${quiz.course_id}`}><ArrowLeft className="mr-2 h-4 w-4" /> Kembali</Link>} variant="outline" className="w-full sm:w-auto" />
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {completedAttemptsCount > 0 && (
              <Button nativeButton={false} render={<Link href={`/cbt/${quiz.id}/review`}>Lihat Hasil & Pembahasan</Link>} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white" />
            )}
            
            {hasActiveAttempt ? (
              <StartQuizButton quizId={quizId} label="Lanjutkan Kuis" />
            ) : maxAttemptsReached ? (
              <Button disabled className="w-full sm:w-auto">Batas Percobaan Tercapai</Button>
            ) : questionCount === 0 ? (
              <Button disabled className="w-full sm:w-auto">Tidak Ada Soal</Button>
            ) : (
              <StartQuizButton quizId={quizId} label={completedAttemptsCount > 0 ? "Ulangi Kuis" : "Mulai Kuis"} />
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
