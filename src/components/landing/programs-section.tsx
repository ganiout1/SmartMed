"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROGRAMS } from "@/lib/constants";
import { AnimatedSection, AnimatedDiv } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";

export function ProgramsSection() {
  return (
    <AnimatedSection
      id="program"
      className="scroll-mt-24 bg-white py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Program Kami"
          title="Pilih Program yang Sesuai dengan Kebutuhan Anda"
          subtitle="Kami menyediakan berbagai program bimbingan yang dirancang khusus untuk membantu mahasiswa kedokteran di setiap tahap perjalanan akademik mereka."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map((program, index) => (
            <AnimatedDiv
              key={program.title}
              delay={index * 0.1}
              className="group flex flex-col rounded-2xl border-2 border-border bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/20"
            >
              {/* Icon */}
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-text-primary shadow-sm transition-transform group-hover:scale-110">
                <program.icon size={28} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-text-primary">
                {program.title}
              </h3>

              {/* Description */}
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                {program.description}
              </p>

              {/* Tags */}
              <div className="mt-5 flex flex-wrap gap-2">
                {program.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/30 px-3 py-1 text-xs font-bold text-text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA Link */}
              <Link
                href="#kontak"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
              >
                Pelajari Lebih Lanjut
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
