"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: "Email atau kata sandi tidak valid. Silakan coba lagi." };
  }

  // User logged in successfully, middleware will handle the redirection to the correct dashboard.
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/update-password`,
  });

  if (error) {
    return { error: "Gagal mengirim tautan pengaturan ulang kata sandi." };
  }

  return { success: "Tautan pengaturan ulang kata sandi telah dikirim ke email Anda." };
}

export async function logout() {
  const supabase = await createClient();
  
  await supabase.auth.signOut();
  
  revalidatePath("/", "layout");
  redirect("/login");
}
