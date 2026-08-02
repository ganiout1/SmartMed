"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * Get client IP from server action context.
 */
async function getActionClientIp(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

export async function login(formData: FormData) {
  // Rate limit check
  const ip = await getActionClientIp();
  const result = rateLimit(`action:login:${ip}`, RATE_LIMITS.login);
  if (!result.success) {
    return { error: "Terlalu banyak percobaan login. Silakan coba lagi dalam 1 menit." };
  }

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
  return { success: true };
}

export async function register(formData: FormData) {
  // Rate limit check
  const ip = await getActionClientIp();
  const result = rateLimit(`action:signup:${ip}`, RATE_LIMITS.signup);
  if (!result.success) {
    return { error: "Terlalu banyak percobaan pendaftaran. Silakan coba lagi dalam 1 menit." };
  }

  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "student", // default role
      },
    },
  });

  if (error) {
    console.error("Signup error:", error);
    const errorMessage = typeof error.message === 'string' && error.message.trim() !== '' 
      ? error.message 
      : (typeof error === 'string' ? error : JSON.stringify(error));
    return { error: errorMessage !== "{}" ? errorMessage : "Gagal mendaftar. Silakan coba lagi." };
  }

  // Registration successful, usually they need to confirm email if it's turned on in Supabase,
  // but if disabled, they can login immediately or are logged in automatically.
  // We'll return success and redirect to login or dashboard.
  return { success: "Pendaftaran berhasil! Silakan periksa email Anda atau langsung masuk." };
}

export async function resetPassword(formData: FormData) {
  // Rate limit check
  const ip = await getActionClientIp();
  const result = rateLimit(`action:forgot:${ip}`, RATE_LIMITS.forgotPassword);
  if (!result.success) {
    return { error: "Terlalu banyak permintaan reset kata sandi. Silakan coba lagi dalam 1 menit." };
  }

  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/update-password`,
  });

  if (error) {
    return { error: "Gagal mengirim tautan pengaturan ulang kata sandi." };
  }

  return { success: "Tautan pengaturan ulang kata sandi telah dikirim ke email Anda." };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: "Gagal memperbarui kata sandi: " + error.message };
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  
  await supabase.auth.signOut();
  
  revalidatePath("/", "layout");
  redirect("/login");
}

