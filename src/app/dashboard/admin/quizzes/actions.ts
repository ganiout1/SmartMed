"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function moveQuizToCourse(quizId: string, targetCourseId: string) {
  const supabase = await createClient();

  // 1. Verify quiz exists
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("id, course_id, title")
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) {
    return { error: "Kuis tidak ditemukan." };
  }

  // 2. Don't move to the same course
  if (quiz.course_id === targetCourseId) {
    return { error: "Kuis sudah berada di kursus ini." };
  }

  // 3. Verify target course exists
  const { data: targetCourse, error: courseError } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", targetCourseId)
    .single();

  if (courseError || !targetCourse) {
    return { error: "Kursus tujuan tidak ditemukan." };
  }

  // 4. Update the quiz's course_id — all related data (questions, attempts, answers)
  // automatically follows because they reference quiz_id, not course_id
  const { error: updateError } = await supabase
    .from("quizzes")
    .update({
      course_id: targetCourseId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", quizId);

  if (updateError) {
    return { error: "Gagal memindahkan kuis: " + updateError.message };
  }

  // 5. Also update course_id in questions table if it has that column
  await supabase
    .from("questions")
    .update({ course_id: targetCourseId })
    .eq("quiz_id", quizId);

  // 6. Revalidate both old and new course pages
  revalidatePath(`/dashboard/lecturer/courses/${quiz.course_id}`);
  revalidatePath(`/dashboard/lecturer/courses/${targetCourseId}`);
  revalidatePath(`/dashboard/admin/courses`);
  revalidatePath(`/dashboard/student/ranking`);
  revalidatePath(`/dashboard/student/courses`);

  return {
    success: true,
    message: `Kuis "${quiz.title}" berhasil dipindahkan ke kursus "${targetCourse.title}".`,
  };
}
