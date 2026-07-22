import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, FileQuestion, CheckCircle, Clock, TrendingUp, ArrowRight, Lock, Unlock, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EnrollmentModal } from "@/components/student/enrollment-modal";

export default async function StudentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.q || "";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch Profile (for tier)
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();
  const isPro = profile?.tier === "pro";

  // 2. Fetch Enrollments
  const { data: enrollments } = await supabase
    .from("course_members")
    .select("course_id")
    .eq("student_id", user.id);
    
  const enrolledCourseIds = (enrollments || []).map(e => e.course_id);
  const coursesCount = enrolledCourseIds.length;

  // 3. Fetch all courses (for the list)
  let query = supabase
    .from("courses")
    .select(`
      id,
      title,
      description,
      banner_url,
      quizzes (count)
    `)
    .order("title");

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }
  const { data: allCourses } = await query;
  
  let totalQuizzesCount = 0;
  if (coursesCount > 0) {
    const { count } = await supabase
      .from("quizzes")
      .select("*", { count: "exact", head: true })
      .in("course_id", enrolledCourseIds)
      .eq("status", "published");
    totalQuizzesCount = count || 0;
  }

  // 4. Kuis Selesai
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("quiz_id, score")
    .eq("student_id", user.id)
    .not("score", "is", null);

  const completedQuizIds = new Set((attempts || []).map(a => a.quiz_id));
  const completedQuizzesCount = completedQuizIds.size;
  const pendingQuizzesCount = Math.max(0, totalQuizzesCount - completedQuizzesCount);

  let averageScore = 0;
  if (attempts && attempts.length > 0) {
    const totalScore = attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
    averageScore = Math.round(totalScore / attempts.length);
  }

  const summaryCards = [
    {
      title: "Kursus Diikuti",
      value: coursesCount,
      icon: BookOpen,
      description: "Total kursus yang Anda pelajari",
    },
    {
      title: "Total Kuis",
      value: totalQuizzesCount,
      icon: FileQuestion,
      description: "Kuis tersedia dari kursus Anda",
    },
    {
      title: "Kuis Selesai",
      value: completedQuizzesCount,
      icon: CheckCircle,
      description: "Kuis yang sudah Anda kerjakan",
    },
    {
      title: "Belum Dikerjakan",
      value: pendingQuizzesCount,
      icon: Clock,
      description: "Kuis yang menunggu dikerjakan",
    },
    {
      title: "Nilai Rata-rata",
      value: averageScore,
      icon: TrendingUp,
      description: "Dari semua hasil kuis Anda",
    },
  ];

  // Transform courses
  const transformedCourses = (allCourses || []).map((c: any) => {
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      banner_url: c.banner_url,
      quiz_count: c.quizzes[0]?.count || 0,
      isEnrolled: enrolledCourseIds.includes(c.id),
    };
  });

  const enrolledCoursesList = transformedCourses.filter(c => c.isEnrolled);
  const lockedCoursesList = transformedCourses.filter(c => !c.isEnrolled);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-8">
      <div>
        <SectionHeader
          title="Dashboard Mahasiswa"
          subtitle="Pantau progres belajar dan hasil kuis Anda."
          align="center"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-6">
          {summaryCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold tracking-tight">Katalog Kursus</h2>
          <form className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="q"
              placeholder="Cari kursus..."
              className="pl-8"
              defaultValue={searchQuery}
            />
          </form>
        </div>

        <Tabs defaultValue="enrolled" className="w-full">
          <TabsList>
            <TabsTrigger value="enrolled">Kursus Terbuka ({enrolledCoursesList.length})</TabsTrigger>
            <TabsTrigger value="locked">Kursus Terkunci ({lockedCoursesList.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="pt-6">
            {enrolledCoursesList.length === 0 ? (
              <div className="text-center py-24 bg-background border rounded-lg">
                <Unlock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-medium">Anda belum bergabung ke kursus manapun.</p>
                <p className="text-sm text-muted-foreground mt-1">Gunakan Enrollment Key untuk membuka akses materi ujian.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCoursesList.map((course) => (
                  <Card key={course.id} className="flex flex-col overflow-hidden border-primary/20 bg-primary/5">
                    <div className="relative w-full aspect-square bg-muted">
                      <Image
                        src={course.banner_url || "/default-banner.png"}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{course.title}</CardTitle>
                        <Unlock className="h-5 w-5 text-primary" />
                      </div>
                      <CardDescription className="line-clamp-2 pt-1">
                        {course.description || "Tidak ada deskripsi"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FileQuestion className="h-4 w-4" />
                          <span>{course.quiz_count} Kuis Tersedia</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button nativeButton={false} render={
                        <Link href={`/dashboard/student/courses/${course.id}`}>
                          Buka Kursus
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      } className="w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="locked" className="pt-6">
            {lockedCoursesList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Tidak ada kursus yang terkunci. Anda sudah mengikuti semua kursus.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lockedCoursesList.map((course) => (
                  <Card key={course.id} className="flex flex-col overflow-hidden">
                    <div className="relative w-full aspect-square bg-muted opacity-70">
                      <Image
                        src={course.banner_url || "/default-banner.png"}
                        alt={course.title}
                        fill
                        className="object-cover grayscale"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-muted-foreground">{course.title}</CardTitle>
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardDescription className="line-clamp-2 pt-1">
                        {course.description || "Tidak ada deskripsi"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 opacity-70">
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FileQuestion className="h-4 w-4" />
                          <span>{course.quiz_count} Kuis</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {isPro ? (
                        <form action={async () => {
                          "use server";
                          const { enrollProCourse } = await import("@/app/dashboard/student/courses/actions");
                          await enrollProCourse(course.id);
                        }} className="w-full">
                          <Button type="submit" variant="default" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            <Unlock className="mr-2 h-4 w-4" />
                            Daftar Instan (PRO)
                          </Button>
                        </form>
                      ) : (
                        <EnrollmentModal className="w-full" />
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
