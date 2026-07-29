"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { updatePassword } from "../actions";
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
import { AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UpdatePasswordPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(searchParams.get("error_description") || null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    const result = await updatePassword(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(true);
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Lock className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Perbarui Kata Sandi</CardTitle>
        <CardDescription>
          Masukkan kata sandi baru untuk akun Anda.
        </CardDescription>
      </CardHeader>
      
      {success ? (
        <CardContent className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 ml-2">
              Kata sandi Anda berhasil diperbarui. Silakan login dengan kata sandi baru Anda.
            </AlertDescription>
          </Alert>
          <div className="pt-4">
            <Link href="/login" className="w-full flex justify-center">
              <Button className="w-full">Ke Halaman Login</Button>
            </Link>
          </div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2">{error.replace(/\+/g, ' ')}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi Baru</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Kata Sandi"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Ingat kata sandi Anda?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Kembali ke Login
              </Link>
            </div>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
