"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function resetQuizAttempt(attemptId: string) {
  const supabase = await createClient();

  // Deleting the attempt will cascade delete the answers
  const { error } = await supabase.from("quiz_attempts").delete().eq("id", attemptId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/admin/results");
  return { success: true };
}
