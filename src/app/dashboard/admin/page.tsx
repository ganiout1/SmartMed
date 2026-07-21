import { createClient } from "@/lib/supabase/server";
import { Users, BookOpen, FileQuestion, PenTool } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

async function getStats() {
  const supabase = await createClient();

  const [students, lecturers, courses, quizzes, attempts] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "lecturer"),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("quizzes").select("*", { count: "exact", head: true }),
    supabase.from("quiz_attempts").select("*", { count: "exact", head: true }),
  ]);

  return {
    students: students.count || 0,
    lecturers: lecturers.count || 0,
    courses: courses.count || 0,
    quizzes: quizzes.count || 0,
    attempts: attempts.count || 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const summaryCards = [
    {
      title: "Total Mahasiswa",
      value: stats.students,
      icon: Users,
      description: "Terdaftar dalam sistem",
    },
    {
      title: "Total Dosen",
      value: stats.lecturers,
      icon: Users,
      description: "Pengajar aktif",
    },
    {
      title: "Total Kursus",
      value: stats.courses,
      icon: BookOpen,
      description: "Modul pembelajaran",
    },
    {
      title: "Total Kuis",
      value: stats.quizzes,
      icon: FileQuestion,
      description: "Bank soal",
    },
    {
      title: "Total Percobaan",
      value: stats.attempts,
      icon: PenTool,
      description: "Ujian diselesaikan",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="Ringkasan Sistem"
        subtitle="Pantau statistik penggunaan sistem SmartMed CBT secara real-time."
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
