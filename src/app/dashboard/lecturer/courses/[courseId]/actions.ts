"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createQuiz(courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const durationStr = formData.get("duration") as string;
  const passingScoreStr = formData.get("passingScore") as string;
  const status = formData.get("status") as string || "draft";
  const randomizeQuestions = formData.get("randomizeQuestions") === "on";
  const randomizeAnswers = formData.get("randomizeAnswers") === "on";

  if (!title) {
    return { error: "Judul kuis wajib diisi" };
  }

  const duration = durationStr ? parseInt(durationStr) : 0;
  const passingScore = passingScoreStr ? parseInt(passingScoreStr) : 0;

  const supabase = await createClient();

  const { error } = await supabase.from("quizzes").insert({
    course_id: courseId,
    title,
    description,
    duration_minutes: duration,
    passing_score: passingScore,
    status,
    randomize_questions: randomizeQuestions,
    randomize_answers: randomizeAnswers,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/lecturer/courses/${courseId}`);
  return { success: true };
}

export async function updateQuiz(courseId: string, quizId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const durationStr = formData.get("duration") as string;
  const passingScoreStr = formData.get("passingScore") as string;
  const status = formData.get("status") as string || "draft";
  const randomizeQuestions = formData.get("randomizeQuestions") === "on";
  const randomizeAnswers = formData.get("randomizeAnswers") === "on";

  if (!title) {
    return { error: "Judul kuis wajib diisi" };
  }

  const duration = durationStr ? parseInt(durationStr) : 0;
  const passingScore = passingScoreStr ? parseInt(passingScoreStr) : 0;

  const supabase = await createClient();

  const { error } = await supabase
    .from("quizzes")
    .update({
      title,
      description,
      duration_minutes: duration,
      passing_score: passingScore,
      status,
      randomize_questions: randomizeQuestions,
      randomize_answers: randomizeAnswers,
      updated_at: new Date().toISOString()
    })
    .eq("id", quizId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/lecturer/courses/${courseId}`);
  revalidatePath(`/dashboard/lecturer/quizzes/${quizId}`);
  return { success: true };
}

export async function deleteQuiz(courseId: string, quizId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("quizzes").delete().eq("id", quizId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/lecturer/courses/${courseId}`);
  return { success: true };
}
