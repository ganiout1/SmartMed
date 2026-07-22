"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function enrollCourse(formData: FormData) {
  const keyCode = formData.get("keyCode") as string;

  if (!keyCode) {
    return { error: "Enrollment key wajib diisi" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid, silakan login kembali." };
  }

  // 1. Validate the enrollment key
  const { data: keyData, error: keyError } = await supabase
    .from("enrollment_keys")
    .select("*")
    .eq("key_code", keyCode)
    .single();

  if (keyError || !keyData) {
    return { error: "Enrollment key tidak valid atau tidak ditemukan." };
  }

  // 2. Check if key is expired
  if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
    return { error: "Enrollment key sudah kedaluwarsa." };
  }

  // 3. Check usage limit
  if (keyData.usage_limit !== null && keyData.usage_count >= keyData.usage_limit) {
    return { error: "Enrollment key sudah mencapai batas kuota penggunaan." };
  }

  const courseId = keyData.course_id;

  // 4. Check if student is already enrolled
  const { data: existingMember } = await supabase
    .from("course_members")
    .select("*")
    .eq("course_id", courseId)
    .eq("student_id", user.id)
    .single();

  if (existingMember) {
    return { error: "Anda sudah terdaftar di kursus ini." };
  }

  // 5. Enroll the student
  const { error: enrollError } = await supabase
    .from("course_members")
    .insert({
      course_id: courseId,
      student_id: user.id
    });

  if (enrollError) {
    return { error: `Gagal mendaftar: ${enrollError.message}` };
  }

  // 6. Update usage count for the key
  await supabase
    .from("enrollment_keys")
    .update({ usage_count: keyData.usage_count + 1 })
    .eq("id", keyData.id);

  revalidatePath("/dashboard/student/courses");
  return { success: true, message: "Berhasil bergabung ke kursus!" };
}

export async function enrollProCourse(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid, silakan login kembali." };
  }

  // 1. Verify that user is PRO
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  if (!profile || profile.tier !== "pro") {
    return { error: "Akses ditolak. Fitur ini khusus untuk akun PRO." };
  }

  // 2. Check if student is already enrolled
  const { data: existingMember } = await supabase
    .from("course_members")
    .select("*")
    .eq("course_id", courseId)
    .eq("student_id", user.id)
    .single();

  if (existingMember) {
    return { error: "Anda sudah terdaftar di kursus ini." };
  }

  // 3. Enroll the student directly
  const { error: enrollError } = await supabase
    .from("course_members")
    .insert({
      course_id: courseId,
      student_id: user.id
    });

  if (enrollError) {
    return { error: `Gagal mendaftar: ${enrollError.message}` };
  }

  revalidatePath("/dashboard/student/courses");
  return { success: true, message: "Berhasil bergabung secara instan (PRO)!" };
}
