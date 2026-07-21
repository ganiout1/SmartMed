"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    const result = await resetPassword(formData);
    
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
        <CardTitle className="text-2xl font-bold text-text-primary">Lupa Kata Sandi</CardTitle>
        <CardDescription className="text-text-secondary">
          Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form action={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-error/10 p-3 text-sm font-medium text-error">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="flex items-start gap-2 rounded-lg bg-success/10 p-3 text-sm font-medium text-success">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <p>{success}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-text-primary font-semibold">Email Terdaftar</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="nama@email.com" 
              required 
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
                Mengirim...
              </>
            ) : (
              "Kirim Tautan Pengaturan Ulang"
            )}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="justify-center border-t border-border/40 pt-6 pb-2">
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke halaman Masuk
        </Link>
      </CardFooter>
    </Card>
  );
}
