"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "lecturer" | "student";

  if (!fullName || !email || !password || !role) {
    return { error: "Semua kolom wajib diisi" };
  }

  const supabaseAdmin = createAdminClient();

  // Create user using Supabase Admin API
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: role,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // The database trigger will automatically create the profile for this user
  
  if (role === "lecturer") {
    revalidatePath("/dashboard/admin/lecturers");
  } else {
    revalidatePath("/dashboard/admin/students");
  }

  return { success: true };
}

export async function deleteUser(userId: string, role: string) {
  const supabaseAdmin = createAdminClient();

  // Delete user from auth.users (will cascade delete profile)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    return { error: error.message };
  }

  if (role === "lecturer") {
    revalidatePath("/dashboard/admin/lecturers");
  } else {
    revalidatePath("/dashboard/admin/students");
  }

  return { success: true };
}

export async function updateUserProfile(
  userId: string,
  role: string,
  formData: FormData
) {
  const fullName = formData.get("fullName") as string;
  
  if (!fullName) {
    return { error: "Nama lengkap wajib diisi" };
  }

  const supabaseAdmin = createAdminClient();

  // Update profile full name
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  // Update auth metadata
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { full_name: fullName }
  });

  if (role === "lecturer") {
    revalidatePath("/dashboard/admin/lecturers");
  } else {
    revalidatePath("/dashboard/admin/students");
  }

  return { success: true };
}
