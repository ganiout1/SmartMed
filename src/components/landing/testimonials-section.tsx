"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  }, []);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  const testimonial = TESTIMONIALS[current];

  return (
    <AnimatedSection
      id="testimoni"
      className="scroll-mt-24 bg-surface py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Testimoni"
          title="Apa Kata Alumni Kami"
          subtitle="Dengarkan pengalaman langsung dari mahasiswa kedokteran yang telah merasakan manfaat bimbingan SmartMed."
        />

        <div
          className="mx-auto max-w-3xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonial Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-8 md:p-12">
            {/* Quote icon */}
            <Quote
              size={48}
              className="absolute top-6 right-8 text-primary/20"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <blockquote className="relative text-base leading-relaxed text-text-secondary md:text-lg">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="mt-8 flex items-center gap-4">
                  {/* Avatar placeholder */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-semibold text-accent">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {testimonial.university}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-accent">
                      {testimonial.achievement}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              {/* Dots */}
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      index === current
                        ? "w-6 bg-accent"
                        : "w-2 bg-border hover:bg-primary/40"
                    )}
                    aria-label={`Testimoni ${index + 1}`}
                  />
                ))}
              </div>

              {/* Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white transition-colors hover:border-primary/40 hover:bg-primary/5"
                  aria-label="Testimoni sebelumnya"
                >
                  <ChevronLeft size={18} className="text-text-primary" />
                </button>
                <button
                  onClick={next}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white transition-colors hover:border-primary/40 hover:bg-primary/5"
                  aria-label="Testimoni berikutnya"
                >
                  <ChevronRight size={18} className="text-text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
