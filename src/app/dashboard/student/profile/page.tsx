import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SectionHeader } from "@/components/ui/section-header";
import { ProfileForms } from "@/components/student/profile-forms";

export default async function StudentProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) return redirect("/login");

  const initialData = {
    fullName: profile.full_name,
    email: profile.email,
    avatarUrl: profile.avatar_url,
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionHeader
        title="Profil Saya"
        subtitle="Kelola informasi pribadi dan keamanan akun Anda."
        align="left"
      />

      <ProfileForms initialData={initialData} />
    </div>
  );
}
