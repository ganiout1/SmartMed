"use client";

import { ABOUT_FEATURES } from "@/lib/constants";
import { AnimatedSection, AnimatedDiv } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";

export function AboutSection() {
  return (
    <AnimatedSection
      id="tentang"
      className="scroll-mt-24 py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Tentang Kami"
          title="Bimbingan Kedokteran yang Dirancang untuk Kesuksesan Anda"
          subtitle="SmartMed hadir sebagai mitra belajar mahasiswa kedokteran dengan pendekatan personal dan kurikulum yang teruji. Kami memahami tantangan dunia preklinik dan siap membantu Anda melewatinya."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ABOUT_FEATURES.map((feature, index) => (
            <AnimatedDiv
              key={feature.title}
              delay={index * 0.1}
              className="group rounded-2xl border border-border bg-surface p-8 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-accent transition-colors group-hover:bg-primary/25">
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
