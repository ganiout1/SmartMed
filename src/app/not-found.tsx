import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20 px-4 text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <SearchX className="h-16 w-16 text-primary" />
      </div>
      <h1 className="text-4xl font-black tracking-tight mb-2">404</h1>
      <h2 className="text-2xl font-bold mb-4">Halaman Tidak Ditemukan</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Maaf, kami tidak dapat menemukan halaman yang Anda cari. Halaman mungkin telah dihapus, namanya diubah, atau sementara tidak tersedia.
      </p>
      <div className="flex gap-4">
        <Button nativeButton={false} render={<Link href="/">Kembali ke Beranda</Link>} variant="default" />
      </div>
    </div>
  );
}
