"use client";

import { FAQ_ITEMS } from "@/lib/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection, AnimatedDiv } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";

export function FAQSection() {
  return (
    <AnimatedSection
      id="faq"
      className="scroll-mt-24 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="FAQ"
          title="Pertanyaan yang Sering Diajukan"
          subtitle="Temukan jawaban atas pertanyaan yang paling sering ditanyakan tentang program dan layanan SmartMed."
        />

        <AnimatedDiv delay={0.1} className="mx-auto max-w-3xl">
          <Accordion className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-2xl border border-border bg-surface px-6 transition-colors data-[state=open]:border-primary/30 data-[state=open]:bg-primary/[0.03]"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-text-primary hover:no-underline [&[data-state=open]>svg]:text-accent">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-text-secondary">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedDiv>
      </div>
    </AnimatedSection>
  );
}
