import { HeroSection } from "@/components/landing/hero-section";
import { MarqueeSection } from "@/components/landing/marquee-section";
import { ProgramsSection } from "@/components/landing/programs-section";
import { WhySection } from "@/components/landing/why-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { ContactSection } from "@/components/landing/contact-section";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <ProgramsSection />
      <WhySection />
      <TestimonialsSection />
      <ContactSection />
      <CTASection />
    </>
  );
}
