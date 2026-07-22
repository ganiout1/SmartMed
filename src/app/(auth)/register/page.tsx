"use client";

import { useState } from "react";
import Link from "next/link";
import { register } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    const result = await register(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }
    
    setIsLoading(false);
  }

  return (
    <Card className="w-full border-border/60 shadow-xl shadow-primary/5">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-bold text-text-primary">Daftar Akun Baru</CardTitle>
        <CardDescription className="text-text-secondary">
          Lengkapi data di bawah ini untuk mendaftar sebagai Pengguna Baru.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form action={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-error/10 p-3 text-sm font-medium text-error">
              <AlertCircle size={16} />
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm font-medium text-success-hover">
              <CheckCircle2 size={16} />
              <p>{success}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-text-primary font-semibold">Nama Lengkap</Label>
            <Input 
              id="full_name" 
              name="full_name" 
              type="text" 
              placeholder="Masukkan nama lengkap" 
              required 
              className="bg-surface focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-text-primary font-semibold">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="nama@email.com" 
              required 
              className="bg-surface focus-visible:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-text-primary font-semibold">Kata Sandi</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              placeholder="Minimal 6 karakter"
              minLength={6}
              className="bg-surface focus-visible:ring-primary"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-text-primary text-white hover:bg-[#F5C97A] hover:text-text-primary transition-all font-semibold py-5 rounded-xl shadow-md"
            disabled={isLoading || !!success}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="justify-center border-t border-border/40 pt-6 pb-2">
        <p className="text-sm text-text-secondary text-center">
          Sudah memiliki akun?{" "}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Masuk di sini
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
