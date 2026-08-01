import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { SectionHeader } from "@/components/ui/section-header";
import { LeaderboardTable, StudentLeaderboardData } from "./leaderboard-table";

export const metadata = {
  title: "Peringkat Mahasiswa - SmartMED",
  description: "Peringkat mahasiswa berdasarkan rata-rata nilai kuis.",
};

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Get courses taught by this lecturer
  const { data: assignments } = await supabase
    .from("course_lecturers")
    .select("course_id")
    .eq("lecturer_id", user.id);

  const courseIds = assignments?.map((a) => a.course_id) || [];

  if (courseIds.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <SectionHeader
          title="Peringkat Mahasiswa"
          subtitle="Daftar nilai rata-rata dan kuis yang dikerjakan mahasiswa."
        />
        <LeaderboardTable data={[]} />
      </div>
    );
  }

  // 2. Get quizzes for these courses
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, title")
    .in("course_id", courseIds);

  const quizIds = quizzes?.map((q) => q.id) || [];
  const quizMap = new Map(quizzes?.map(q => [q.id, q.title]));

  if (quizIds.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <SectionHeader
          title="Peringkat Mahasiswa"
          subtitle="Daftar nilai rata-rata dan kuis yang dikerjakan mahasiswa."
        />
        <LeaderboardTable data={[]} />
      </div>
    );
  }

  // 3. Get all quiz attempts with scores (using Admin Client to bypass RLS on profiles)
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: attempts } = await supabaseAdmin
    .from("quiz_attempts")
    .select(`
      id, score, quiz_id, student_id,
      profiles:student_id (full_name)
    `)
    .in("quiz_id", quizIds)
    .not("score", "is", null);

  // 4. Process data: Group by student, then get max score per quiz
  const studentMap = new Map<string, {
    student_id: string;
    name: string;
    quizzes: Map<string, number>; // quiz_id -> max score
  }>();

  (attempts || []).forEach((attempt: any) => {
    const studentId = attempt.student_id;
    // Handle cases where profile might be an array or object depending on relation
    const profileData = attempt.profiles;
    const studentName = (Array.isArray(profileData) ? profileData[0]?.full_name : profileData?.full_name) || "Mahasiswa Tidak Diketahui";
    const quizId = attempt.quiz_id;
    const score = attempt.score || 0;

    if (!studentMap.has(studentId)) {
      studentMap.set(studentId, {
        student_id: studentId,
        name: studentName,
        quizzes: new Map(),
      });
    }

    const studentData = studentMap.get(studentId)!;
    const currentMax = studentData.quizzes.get(quizId) || 0;
    
    // Only keep the highest score for the same quiz
    if (score > currentMax) {
      studentData.quizzes.set(quizId, score);
    }
  });

  // 5. Calculate averages and format data
  const leaderboardData: StudentLeaderboardData[] = Array.from(studentMap.values()).map(student => {
    let totalScore = 0;
    const quizDetails: { quiz_id: string; title: string; maxScore: number }[] = [];

    student.quizzes.forEach((maxScore, quizId) => {
      totalScore += maxScore;
      quizDetails.push({
        quiz_id: quizId,
        title: quizMap.get(quizId) || "Kuis Tidak Diketahui",
        maxScore,
      });
    });

    const quizzesCompleted = student.quizzes.size;
    const averageScore = quizzesCompleted > 0 ? totalScore / quizzesCompleted : 0;

    return {
      student_id: student.student_id,
      name: student.name,
      averageScore,
      quizzesCompleted,
      quizzes: quizDetails.sort((a, b) => b.maxScore - a.maxScore), // Sort quizzes by score desc
    };
  });

  // 6. Sort students by average score descending
  leaderboardData.sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="Peringkat Mahasiswa"
        subtitle="Daftar nilai rata-rata tertinggi dari semua kuis yang dikerjakan mahasiswa di kelas Anda."
      />
      <LeaderboardTable data={leaderboardData} />
    </div>
  );
}
