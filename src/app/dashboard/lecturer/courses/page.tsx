import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileQuestion, ArrowRight } from "lucide-react";

export default async function LecturerCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch courses assigned to the lecturer
  const { data: courses } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      description,
      course_members (count),
      quizzes (count)
    `)
    .order("title");

  const transformedCourses = (courses || []).map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    student_count: c.course_members[0]?.count || 0,
    quiz_count: c.quizzes[0]?.count || 0,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="Kursus Saya"
        subtitle="Daftar kursus yang ditugaskan kepada Anda. Pilih kursus untuk mengelola kuis dan soal."
        align="left"
      />

      {transformedCourses.length === 0 ? (
        <div className="text-center py-24 bg-background border rounded-lg">
          <p className="text-muted-foreground">Anda belum ditugaskan ke kursus manapun.</p>
          <p className="text-sm text-muted-foreground mt-1">Silakan hubungi Administrator sistem.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transformedCourses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description || "Tidak ada deskripsi"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.student_count} Mahasiswa</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileQuestion className="h-4 w-4" />
                    <span>{course.quiz_count} Kuis</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button render={
                  <Link href={`/dashboard/lecturer/courses/${course.id}`}>
                    Kelola Kursus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                } className="w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
