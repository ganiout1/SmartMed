import Link from "next/link";
import Image from "next/image";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <Link
        href="/"
        className="mb-8 transition-transform hover:scale-105"
      >
        <Image 
          src="/logo.png" 
          alt="SmartMED" 
          width={600} 
          height={180} 
          className="object-contain h-32 md:h-36 w-auto" 
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
