"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function assignLecturer(formData: FormData) {
  const courseId = formData.get("courseId") as string;
  const lecturerId = formData.get("lecturerId") as string;

  if (!courseId || !lecturerId) {
    return { error: "Kursus dan dosen wajib dipilih" };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("course_lecturers").insert({
    course_id: courseId,
    lecturer_id: lecturerId,
  });

  if (error) {
    // Unique violation means already assigned
    if (error.code === "23505") {
      return { error: "Dosen sudah ditugaskan ke kursus ini" };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard/admin/assignments");
  return { success: true };
}

export async function unassignLecturer(courseId: string, lecturerId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("course_lecturers")
    .delete()
    .match({ course_id: courseId, lecturer_id: lecturerId });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/admin/assignments");
  return { success: true };
}
