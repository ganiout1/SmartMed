import { createClient } from "@/lib/supabase/server";
import { BookOpen, FileQuestion, Users, HelpCircle, PenTool } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

async function getLecturerStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { courses: 0, quizzes: 0, questions: 0, students: 0, attempts: 0 };

  // Explicitly fetch courses assigned to this lecturer
  const { data: assignments } = await supabase
    .from("course_lecturers")
    .select("course_id")
    .eq("lecturer_id", user.id);

  const courseIds = assignments?.map((a) => a.course_id) || [];

  if (courseIds.length === 0) {
    return { courses: 0, quizzes: 0, questions: 0, students: 0, attempts: 0 };
  }

  const [quizzes, questions, students] = await Promise.all([
    supabase.from("quizzes").select("*", { count: "exact", head: true }).in("course_id", courseIds),
    supabase.from("questions").select("*", { count: "exact", head: true }).in("course_id", courseIds),
    supabase.from("course_members").select("student_id", { count: "exact", head: true }).in("course_id", courseIds)
  ]);
  
  // For quiz attempts, it's better to let RLS handle it, or we fetch the user's quizzes first.
  const { data: myQuizzes } = await supabase.from("quizzes").select("id").in("course_id", courseIds);
  const quizIds = myQuizzes?.map(q => q.id) || [];
  
  let attemptsCount = 0;
  if (quizIds.length > 0) {
    const { count } = await supabase.from("quiz_attempts").select("*", { count: "exact", head: true }).in("quiz_id", quizIds);
    attemptsCount = count || 0;
  }

  return {
    courses: courseIds.length,
    quizzes: quizzes.count || 0,
    questions: questions.count || 0,
    students: students.count || 0,
    attempts: attemptsCount,
  };
}

export default async function LecturerDashboardPage() {
  const stats = await getLecturerStats();

  const summaryCards = [
    {
      title: "Total Kursus (Diampu)",
      value: stats.courses,
      icon: BookOpen,
      description: "Kursus yang ditugaskan kepada Anda",
    },
    {
      title: "Total Kuis",
      value: stats.quizzes,
      icon: FileQuestion,
      description: "Kuis yang Anda kelola",
    },
    {
      title: "Total Soal",
      value: stats.questions,
      icon: HelpCircle,
      description: "Soal dalam bank soal Anda",
    },
    {
      title: "Total Mahasiswa",
      value: stats.students,
      icon: Users,
      description: "Peserta di kelas Anda",
    },
    {
      title: "Total Percobaan Kuis",
      value: stats.attempts,
      icon: PenTool,
      description: "Hasil ujian yang masuk",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="Dashboard Dosen"
        subtitle="Pantau ringkasan kelas dan aktivitas ujian mahasiswa Anda."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
  );
}
