"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title) {
    return { error: "Nama kursus wajib diisi" };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("courses").insert({
    title,
    description,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/admin/courses");
  return { success: true };
}

export async function updateCourse(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title) {
    return { error: "Nama kursus wajib diisi" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("courses")
    .update({ title, description, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/admin/courses");
  return { success: true };
}

export async function deleteCourse(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("courses").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/admin/courses");
  return { success: true };
}
