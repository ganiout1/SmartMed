"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createQuestion(quizId: string, formData: FormData) {
  const questionText = formData.get("questionText") as string;
  const optionA = formData.get("optionA") as string;
  const optionB = formData.get("optionB") as string;
  const optionC = formData.get("optionC") as string;
  const optionD = formData.get("optionD") as string;
  const correctOption = formData.get("correctOption") as string;
  const explanationText = formData.get("explanationText") as string;
  const explanationImage = formData.get("explanationImage") as File | null;

  if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctOption) {
    return { error: "Semua isian wajib (kecuali pembahasan) harus diisi" };
  }

  const supabase = await createClient();
  let explanationImageUrl = null;

  // Handle Image Upload if exists
  if (explanationImage && explanationImage.size > 0) {
    const fileExt = explanationImage.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `explanations/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("explanation_images")
      .upload(filePath, explanationImage);

    if (uploadError) {
      return { error: `Gagal mengunggah gambar: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("explanation_images")
      .getPublicUrl(filePath);

    explanationImageUrl = publicUrl;
  }

  const { error } = await supabase.from("questions").insert({
    quiz_id: quizId,
    question_text: questionText,
    option_a: optionA,
    option_b: optionB,
    option_c: optionC,
    option_d: optionD,
    correct_option: correctOption,
    explanation_text: explanationText || null,
    explanation_image_url: explanationImageUrl,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/lecturer/quizzes/${quizId}`);
  return { success: true };
}

export async function updateQuestion(quizId: string, questionId: string, formData: FormData) {
  const questionText = formData.get("questionText") as string;
  const optionA = formData.get("optionA") as string;
  const optionB = formData.get("optionB") as string;
  const optionC = formData.get("optionC") as string;
  const optionD = formData.get("optionD") as string;
  const correctOption = formData.get("correctOption") as string;
  const explanationText = formData.get("explanationText") as string;
  const explanationImage = formData.get("explanationImage") as File | null;
  const removeImage = formData.get("removeImage") === "true";
  const existingImageUrl = formData.get("existingImageUrl") as string;

  if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctOption) {
    return { error: "Semua isian wajib (kecuali pembahasan) harus diisi" };
  }

  const supabase = await createClient();
  let explanationImageUrl = existingImageUrl;

  if (removeImage) {
    explanationImageUrl = "";
  } else if (explanationImage && explanationImage.size > 0) {
    const fileExt = explanationImage.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `explanations/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("explanation_images")
      .upload(filePath, explanationImage);

    if (uploadError) {
      return { error: `Gagal mengunggah gambar: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("explanation_images")
      .getPublicUrl(filePath);

    explanationImageUrl = publicUrl;
  }

  const { error } = await supabase
    .from("questions")
    .update({
      question_text: questionText,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct_option: correctOption,
      explanation_text: explanationText || null,
      explanation_image_url: explanationImageUrl || null,
      updated_at: new Date().toISOString()
    })
    .eq("id", questionId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/lecturer/quizzes/${quizId}`);
  return { success: true };
}

export async function deleteQuestion(quizId: string, questionId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("questions").delete().eq("id", questionId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/lecturer/quizzes/${quizId}`);
  return { success: true };
}

export async function updateQuizSettings(quizId: string, formData: FormData) {
  const durationStr = formData.get("duration") as string;
  const passingScoreStr = formData.get("passingScore") as string;
  const status = formData.get("status") as string;
  const randomizeQuestions = formData.get("randomizeQuestions") === "on";
  const randomizeAnswers = formData.get("randomizeAnswers") === "on";

  const duration = durationStr ? parseInt(durationStr) : 0;
  const passingScore = passingScoreStr ? parseInt(passingScoreStr) : 0;

  const supabase = await createClient();

  const { error } = await supabase
    .from("quizzes")
    .update({
      duration_minutes: duration,
      passing_score: passingScore,
      status: status || "draft",
      randomize_questions: randomizeQuestions,
      randomize_answers: randomizeAnswers,
      updated_at: new Date().toISOString()
    })
    .eq("id", quizId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/lecturer/quizzes/${quizId}`);
  return { success: true };
}
