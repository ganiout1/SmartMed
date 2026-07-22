"use client";

import { ADVANTAGES } from "@/lib/constants";
import { AnimatedSection, AnimatedDiv } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";

export function WhySection() {
  return (
    <AnimatedSection
      id="keunggulan"
      className="scroll-mt-24 py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Keunggulan"
          title="Mengapa Memilih SmartMed?"
          subtitle="Kami menggabungkan keahlian medis, pendekatan personal, dan teknologi untuk memberikan pengalaman belajar terbaik bagi mahasiswa kedokteran."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((advantage, index) => (
            <AnimatedDiv
              key={advantage.number}
              delay={index * 0.08}
              className="group rounded-2xl border-2 border-transparent bg-white p-7 shadow-sm transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/20"
            >
              <div className="flex items-start gap-4">
                {/* Number */}
                <span className="text-3xl font-bold leading-none text-text-primary/60 transition-colors group-hover:text-text-primary">
                  {advantage.number}
                </span>

                <div className="flex-1">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-2.5">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-text-primary shadow-sm">
                      <advantage.icon size={20} />
                    </div>
                    <h3 className="text-base font-semibold text-text-primary">
                      {advantage.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {advantage.description}
                  </p>
                </div>
              </div>
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
