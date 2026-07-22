"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateProfile, updatePassword } from "@/app/dashboard/student/profile/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Key } from "lucide-react";

interface ProfileFormsProps {
  initialData: {
    fullName: string;
    email: string;
  };
}

export function ProfileForms({ initialData }: ProfileFormsProps) {
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingProfile(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
    }
    setLoadingProfile(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingPassword(true);
    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
      (e.target as HTMLFormElement).reset();
    }
    setLoadingPassword(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Informasi Dasar</CardTitle>
          </div>
          <CardDescription>
            Perbarui nama lengkap Anda. Email tidak dapat diubah.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-6 items-start">
              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Asal</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={initialData.email} 
                    disabled 
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Hubungi admin jika Anda harus mengubah email.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    defaultValue={initialData.fullName} 
                    required 
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t p-6">
            <Button type="submit" disabled={loadingProfile}>
              {loadingProfile ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle>Keamanan</CardTitle>
          </div>
          <CardDescription>
            Ubah kata sandi akun Anda secara berkala untuk menjaga keamanan.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <Input 
                id="newPassword" 
                name="newPassword" 
                type="password" 
                required 
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                required 
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t p-6">
            <Button type="submit" variant="secondary" disabled={loadingPassword}>
              {loadingPassword ? "Memperbarui..." : "Perbarui Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
