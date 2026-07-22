import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | SmartMED",
    default: "SmartMED - Platform Ujian Berbasis Komputer Modern",
  },
  description: "Sistem ujian berbasis komputer cerdas untuk institusi pendidikan.",
  keywords: ["CBT", "Ujian Online", "Kedokteran", "SmartMed", "Computer Based Test"],
  openGraph: {
    title: "SmartMED - Platform Ujian Berbasis Komputer Modern",
    description: "Sistem ujian berbasis komputer cerdas untuk institusi pendidikan.",
    url: "https://smartmed.com",
    siteName: "SmartMED",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartMED",
    description: "Platform Ujian Berbasis Komputer Modern",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
