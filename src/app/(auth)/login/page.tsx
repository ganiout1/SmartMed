"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.success) {
      // Redirect to /dashboard — the proxy middleware will route to the correct role dashboard
      window.location.href = "/dashboard";
    }
  }

  return (
    <Card className="w-full border-border/60 shadow-xl shadow-primary/5">
      <CardHeader className="space-y-2 text-center pb-6">
        <CardTitle className="text-2xl font-bold text-text-primary">Selamat Datang Kembali</CardTitle>
        <CardDescription className="text-text-secondary">
          Masukkan email dan kata sandi Anda untuk mengakses dashboard.
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-text-primary font-semibold">Kata Sandi</Label>
              <Link 
                href="/forgot-password" 
                className="text-sm font-medium text-accent hover:underline hover:text-accent/80"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="bg-surface focus-visible:ring-primary"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-text-primary text-white hover:bg-[#F5C97A] hover:text-text-primary transition-all font-semibold py-5 rounded-xl shadow-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk ke Akun"
            )}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="justify-center border-t border-border/40 pt-6 pb-2">
        <p className="text-sm text-text-secondary text-center">
          Belum memiliki akun?{" "}
          <Link href="/register" className="font-semibold text-accent hover:underline">
            Daftar di sini
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
