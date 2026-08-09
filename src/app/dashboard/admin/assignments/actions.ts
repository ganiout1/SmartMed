"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function assignLecturer(formData: FormData) {
  const courseIds = formData.getAll("courseIds") as string[];
  const lecturerId = formData.get("lecturerId") as string;

  if (!courseIds || courseIds.length === 0 || !lecturerId) {
    return { error: "Dosen dan minimal satu kursus wajib dipilih" };
  }

  const supabase = await createClient();

  // Get existing assignments to prevent unique constraint errors
  const { data: existing } = await supabase
    .from("course_lecturers")
    .select("course_id")
    .eq("lecturer_id", lecturerId);

  const existingCourseIds = existing?.map((e) => e.course_id) || [];
  
  const toInsert = courseIds
    .filter(id => !existingCourseIds.includes(id))
    .map(id => ({
      course_id: id,
      lecturer_id: lecturerId
    }));

  if (toInsert.length > 0) {
    const { error } = await supabase.from("course_lecturers").insert(toInsert);
    if (error) {
      return { error: error.message };
    }
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
