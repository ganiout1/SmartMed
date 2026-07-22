import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 relative">
      <Link
        href="/"
        className="absolute left-4 top-4 sm:left-8 sm:top-8 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-muted hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        Kembali ke Beranda
      </Link>

      <Link
        href="/"
        className="mb-8 transition-transform hover:scale-105"
      >
        <Image 
          src="/logo.png" 
          alt="SmartMED" 
          width={1200} 
          height={360} 
          className="object-contain h-64 md:h-72 w-auto" 
        />
      </Link>
      
      <main className="w-full max-w-md">
        {children}
      </main>
      
      <p className="mt-8 text-center text-sm text-text-secondary">
        &copy; {new Date().getFullYear()} SmartMed. Hak cipta dilindungi undang-undang.
      </p>
    </div>
  );
}
