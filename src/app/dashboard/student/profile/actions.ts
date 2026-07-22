"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function updateProfile(formData: FormData) {
  const fullName = formData.get("fullName") as string;

  if (!fullName) {
    return { error: "Nama lengkap wajib diisi" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak valid, silakan login kembali." };
  }

  // Update profile record
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id);

  if (updateError) {
    return { error: `Gagal memperbarui profil: ${updateError.message}` };
  }

  revalidatePath("/dashboard/student/profile");
  return { success: true, message: "Profil berhasil diperbarui!" };
}

export async function updatePassword(formData: FormData) {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || !confirmPassword) {
    return { error: "Semua kolom password wajib diisi" };
  }

  if (newPassword.length < 6) {
    return { error: "Password minimal 6 karakter" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: `Gagal memperbarui password: ${error.message}` };
  }

  return { success: true, message: "Password berhasil diperbarui!" };
}
