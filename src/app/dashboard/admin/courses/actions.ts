"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const bannerFile = formData.get("banner") as File | null;

  if (!title) {
    return { error: "Nama kursus wajib diisi" };
  }

  const supabase = await createClient();
  let banner_url = "/default-banner.png";

  if (bannerFile && bannerFile.size > 0) {
    const fileExt = bannerFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("course_banners")
      .upload(fileName, bannerFile);
    
    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage
        .from("course_banners")
        .getPublicUrl(uploadData.path);
      banner_url = publicUrlData.publicUrl;
    }
  }

  const { error } = await supabase.from("courses").insert({
    title,
    description,
    banner_url,
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
  const bannerFile = formData.get("banner") as File | null;

  if (!title) {
    return { error: "Nama kursus wajib diisi" };
  }

  const supabase = await createClient();
  let updatePayload: any = { title, description, updated_at: new Date().toISOString() };

  if (bannerFile && bannerFile.size > 0) {
    const fileExt = bannerFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("course_banners")
      .upload(fileName, bannerFile);
    
    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage
        .from("course_banners")
        .getPublicUrl(uploadData.path);
      updatePayload.banner_url = publicUrlData.publicUrl;
    }
  }

  const { error } = await supabase
    .from("courses")
    .update(updatePayload)
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
