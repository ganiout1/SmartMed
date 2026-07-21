import { HeroSection } from "@/components/landing/hero-section";
import { AboutSection } from "@/components/landing/about-section";
import { ProgramsSection } from "@/components/landing/programs-section";
import { WhySection } from "@/components/landing/why-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FAQSection } from "@/components/landing/faq-section";
import { ContactSection } from "@/components/landing/contact-section";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <WhySection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <CTASection />
    </>
  );
}
