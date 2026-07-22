"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary via-primary/50 to-white pt-28 pb-8 md:pt-32 md:pb-12 lg:pt-36 lg:pb-16">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/40 blur-[120px]" />
        <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] rounded-full bg-white/40 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-text-primary/10 bg-white px-4 py-1.5 text-sm font-bold text-text-primary shadow-sm">
              <Sparkles size={14} />
              Bimbingan Kedokteran Preklinik
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="mt-8 text-4xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-[4rem]"
          >
            Kuasai Ilmu Kedokteran{" "}
            <span className="relative">
              <span className="relative z-10">Preklinik</span>
              <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-white md:bottom-2 md:h-4" />
            </span>{" "}
            dengan Bimbingan Terbaik
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl"
          >
            SmartMed membantu mahasiswa kedokteran meraih hasil terbaik dalam
            ujian blok, OSCE, dan CBT melalui bimbingan terstruktur dari dokter
            dan tenaga medis profesional.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="#program"
              className="group inline-flex items-center gap-2 rounded-2xl bg-text-primary px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-text-primary/20 transition-all hover:bg-text-primary/90 hover:shadow-xl hover:shadow-text-primary/25 active:scale-[0.98]"
            >
              Lihat Program
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="#kontak"
              className="group inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-7 py-3.5 text-base font-semibold text-text-primary transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
            >
              Hubungi Kami
              <ChevronRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>


        </motion.div>
      </div>
    </section>
  );
}
