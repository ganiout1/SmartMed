"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function startQuiz(quizId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid." };
  }

  // 1. Verify access to this quiz
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("course_id, status, max_attempts")
    .eq("id", quizId)
    .single();

  if (quizError || !quiz || quiz.status !== "published") {
    return { error: "Kuis tidak ditemukan atau belum diterbitkan." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();
  const isPro = profile?.tier === "pro";

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
    return { error: "Anda tidak terdaftar di kursus ini." };
  }

  // 2. Check if student already has a completed attempt
  const { data: existingAttempts } = await supabase
    .from("quiz_attempts")
    .select("id, completed_at")
    .eq("quiz_id", quizId)
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  let activeAttemptId: string | null = null;

  if (existingAttempts && existingAttempts.length > 0) {
    const completedAttempts = existingAttempts.filter(a => a.completed_at !== null);
    if (quiz.max_attempts !== null && completedAttempts.length >= quiz.max_attempts) {
      return { error: `Anda telah mencapai batas maksimal percobaan untuk kuis ini (${quiz.max_attempts} kali).` };
    }
    
    // Found an uncompleted attempt
    const uncompletedAttempt = existingAttempts.find(a => a.completed_at === null);
    if (uncompletedAttempt) {
      activeAttemptId = uncompletedAttempt.id;
    }
  }

  // 3. Create attempt if none exists
  if (!activeAttemptId) {
    const { data: newAttempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .insert({
        quiz_id: quizId,
        student_id: user.id,
      })
      .select("id")
      .single();

    if (attemptError || !newAttempt) {
      return { error: `Gagal memulai kuis: ${attemptError?.message}` };
    }
    activeAttemptId = newAttempt.id;
  }

  return { success: true, attemptId: activeAttemptId };
}

export async function saveAnswer(attemptId: string, questionId: string, selectedOption: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthenticated" };

  // Note: RLS on 'answers' should theoretically protect this, 
  // but we can optionally check if attemptId belongs to user to be 100% sure in SA.
  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("student_id, completed_at")
    .eq("id", attemptId)
    .single();

  if (!attempt || attempt.student_id !== user.id) return { error: "Unauthorized" };
  if (attempt.completed_at) return { error: "Quiz already submitted" };

  const { error } = await supabase
    .from("answers")
    .upsert(
      {
        attempt_id: attemptId,
        question_id: questionId,
        selected_option: selectedOption,
      },
      { onConflict: 'attempt_id,question_id' }
    );

  if (error) {
    console.error("Save answer error:", error);
    return { error: "Failed to save answer" };
  }

  return { success: true };
}

export async function submitQuiz(attemptId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthenticated" };

  // 1. Verify Attempt
  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .select(`
      id, student_id, completed_at,
      quizzes ( id, passing_score )
    `)
    .eq("id", attemptId)
    .single();

  if (attemptError || !attempt || attempt.student_id !== user.id) {
    return { error: "Attempt not found or unauthorized." };
  }

  if (attempt.completed_at) {
    return { error: "Quiz already submitted." };
  }

  const quizId = (attempt.quizzes as any).id;

  // 2. Lock Quiz by setting completed_at
  const now = new Date().toISOString();
  await supabase
    .from("quiz_attempts")
    .update({ completed_at: now })
    .eq("id", attemptId);

  // 3. Calculate Score
  // Fetch all questions for this quiz
  const { data: questions } = await supabase
    .from("questions")
    .select("id, correct_option")
    .eq("quiz_id", quizId);

  // Fetch all student answers for this attempt
  const { data: answers } = await supabase
    .from("answers")
    .select("id, question_id, selected_option")
    .eq("attempt_id", attemptId);

  if (!questions) return { error: "Questions not found." };

  let correctCount = 0;
  const answerUpdates = [];

  for (const q of questions) {
    const studentAns = (answers || []).find(a => a.question_id === q.id);
    const isCorrect = studentAns?.selected_option === q.correct_option;
    
    if (isCorrect) correctCount++;

    if (studentAns) {
      answerUpdates.push({
        id: studentAns.id,
        attempt_id: attemptId,
        question_id: q.id,
        selected_option: studentAns.selected_option,
        is_correct: isCorrect
      });
    }
  }

  // Upsert correct/wrong status to answers table
  if (answerUpdates.length > 0) {
    await supabase.from("answers").upsert(answerUpdates);
  }

  // Calculate percentage score
  const totalQuestions = questions.length;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // 4. Save Final Score
  await supabase
    .from("quiz_attempts")
    .update({ score: score })
    .eq("id", attemptId);

  return { success: true, redirectUrl: `/dashboard/student/history/${attemptId}` };
}
