"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEnrollmentKey(formData: FormData) {
  const courseId = formData.get("courseId") as string;
  const keyCode = formData.get("keyCode") as string;
  const usageLimitStr = formData.get("usageLimit") as string;

  if (!courseId || !keyCode) {
    return { error: "Kursus dan Kode Enrollment wajib diisi" };
  }

  const usageLimit = usageLimitStr ? parseInt(usageLimitStr) : null;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid" };
  }

  const { error } = await supabase.from("enrollment_keys").insert({
    course_id: courseId,
    key_code: keyCode,
    usage_limit: usageLimit,
    created_by: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Kode Enrollment sudah digunakan, gunakan kode lain" };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard/admin/enrollment-keys");
  return { success: true };
}

export async function deleteEnrollmentKey(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("enrollment_keys").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/admin/enrollment-keys");
  return { success: true };
}
