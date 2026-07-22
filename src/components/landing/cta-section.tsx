"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

export function CTASection() {
  return (
    <AnimatedSection className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center sm:px-12 md:py-16 lg:px-16 lg:py-20 shadow-2xl shadow-primary/20">
          {/* Decorative background elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/40 blur-[64px]" />
            <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-white/30 blur-[64px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-tight">
              Siap Menaklukkan Ujian Kedokteran Bersama SmartMed?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
              Bergabunglah dengan ratusan mahasiswa kedokteran lainnya yang telah membuktikan metode bimbingan kami. Jangan tunda kesuksesan akademik Anda.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#kontak"
                className="group inline-flex items-center gap-2 rounded-2xl bg-text-primary px-8 py-4 text-base font-bold text-white transition-all hover:bg-text-primary/90 hover:shadow-xl hover:shadow-text-primary/20 active:scale-[0.98]"
              >
                Mulai Sekarang
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
