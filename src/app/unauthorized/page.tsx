import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20 px-4 text-center">
      <div className="bg-destructive/10 p-6 rounded-full mb-6">
        <ShieldAlert className="h-16 w-16 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Akses Ditolak</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Maaf, Anda tidak memiliki izin (hak akses) untuk melihat halaman ini. Pastikan Anda telah masuk dengan akun yang sesuai.
      </p>
      <div className="flex gap-4">
        <Button nativeButton={false} render={<Link href="/">Kembali ke Beranda</Link>} variant="default" />
      </div>
    </div>
  );
}
