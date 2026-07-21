import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 transition-transform hover:scale-105"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-text-primary text-xl">
          S
        </div>
        <span className="text-2xl font-bold tracking-tight text-text-primary">
          Smart<span className="text-accent">Med</span>
        </span>
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
