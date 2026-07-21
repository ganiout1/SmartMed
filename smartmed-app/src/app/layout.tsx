import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SmartMed — Bimbingan Kedokteran Preklinik Terpercaya",
    template: "%s | SmartMed",
  },
  description:
    "SmartMed adalah lembaga bimbingan belajar kedokteran preklinik terpercaya. Persiapkan ujian blok, OSCE, dan CBT bersama pengajar dokter profesional.",
  keywords: [
    "bimbingan kedokteran",
    "kedokteran preklinik",
    "ujian blok",
    "OSCE",
    "CBT kedokteran",
    "bimbel kedokteran",
    "SmartMed",
  ],
  authors: [{ name: "SmartMed" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "SmartMed",
    title: "SmartMed — Bimbingan Kedokteran Preklinik Terpercaya",
    description:
      "Persiapkan ujian blok, OSCE, dan CBT bersama pengajar dokter profesional. Tingkatkan prestasi akademik Anda bersama SmartMed.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartMed — Bimbingan Kedokteran Preklinik Terpercaya",
    description:
      "Persiapkan ujian blok, OSCE, dan CBT bersama pengajar dokter profesional.",
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
