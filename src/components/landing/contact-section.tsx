"use client";

import { CONTACT_INFO } from "@/lib/constants";
import { AnimatedSection, AnimatedDiv } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";

export function ContactSection() {
  return (
    <AnimatedSection
      id="kontak"
      className="scroll-mt-24 bg-surface py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Kontak"
          title="Hubungi Kami"
          subtitle="Punya pertanyaan atau ingin berkonsultasi mengenai program bimbingan? Tim kami siap membantu Anda."
        />

        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {CONTACT_INFO.map((item, index) => (
            <AnimatedDiv
              key={item.label}
              delay={index * 0.1}
              className="group flex flex-col items-center rounded-2xl border border-border bg-background p-8 text-center transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-accent transition-colors group-hover:bg-primary/20">
                <item.icon size={28} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-text-primary">
                {item.label}
              </h3>
              <p className="mb-6 text-sm text-text-secondary">
                {item.value}
              </p>
              
              {item.href !== "#" && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center rounded-xl bg-primary/10 px-6 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-primary hover:text-text-primary active:scale-[0.98]"
                >
                  Hubungi Sekarang
                </a>
              )}
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
