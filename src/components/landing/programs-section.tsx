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
      className="scroll-mt-24 bg-surface py-20 md:py-28"
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
              className="group flex flex-col rounded-2xl border border-border bg-background p-7 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-accent transition-colors group-hover:bg-primary/25">
                <program.icon size={24} />
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
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-accent"
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
